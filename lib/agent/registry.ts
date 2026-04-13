import { z } from 'zod';
import * as cheerio from 'cheerio';
import * as vectorStore from '../vector-store';
import { createAdminClient } from '../supabase/admin';
import { FACULTY_RULES } from '../faculty-rules';
import Fuse from 'fuse.js';
import PptxGenJS from 'pptxgenjs';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export interface Tool {
    name: string;
    description: string;
    parameters: z.ZodObject<any>;
    execute: (args: any, context?: { userId?: string; conversationId?: string }) => Promise<any>;
}

export const toolRegistry: Record<string, Tool> = {};

export function registerTool(tool: Tool) {
    toolRegistry[tool.name] = tool;
}

// --- Standard Tools ---

// 1. Calculator (Demo for computation)
registerTool({
    name: 'calculate',
    description: 'Perform a mathematical calculation. Use this for precise math.',
    parameters: z.object({
        expression: z.string().describe('The mathematical expression to evaluate, e.g., "2 * 45 + 10"'),
    }),
    execute: async ({ expression }) => {
        try {
            // Tighten security: Strict allowlist prevents external code execution
            if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
                return { error: "Security Error: Invalid characters in expression. Only basic math operators are allowed." };
            }

            // Using sandboxed function evaluation instead of generic eval
            const calculateSafe = new Function('return ' + expression);
            const result = calculateSafe();
            return { result };
        } catch (e) {
            return { error: 'Failed to evaluate expression' };
        }
    },
});

// 2. Generate Image
registerTool({
    name: 'generate_image',
    description: 'Generate an image based on a text prompt.',
    parameters: z.object({
        prompt: z.string().describe('The detailed visual description of the image to generate'),
    }),
    execute: async ({ prompt }) => {
        // Enhance prompt for realism
        const enhancedPrompt = `${prompt}, photorealistic, 4k, highly detailed, cinematic lighting, hd, raw photo`;
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        const seed = Math.floor(Math.random() * 1000000);
        const apiKey = 'sk_mEWxPjZizTEUPa1FsEFasSWkowb0Yzlt';
        const keyParam = `&key=${apiKey}`;
        // Use flux-realism model for better results
        const imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux-realism&nologo=true${keyParam}`;
        console.log("Generated Image URL:", imageUrl);
        return { imageUrl, info: "Image generated successfully. Embed this URL in markdown." };
    },
});

// 3. Wikipedia Search (Encyclopedia implementation)
registerTool({
    name: 'wikipedia_search',
    description: 'Search Wikipedia for reliable, encyclopedic information. Use this to find historical facts, summaries, and general knowledge. Do NOT use for real-time news.',
    parameters: z.object({
        query: z.string().describe('The search query'),
    }),
    execute: async ({ query }) => {
        try {
            const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`;
            const response = await fetch(searchUrl);

            if (!response.ok) {
                return { error: `Search failed with status ${response.status}` };
            }

            const data = await response.json();
            const results = data.query?.search?.map((r: any) => ({
                title: r.title,
                url: `https://en.wikipedia.org/wiki/${encodeURIComponent(r.title.replace(/ /g, '_'))}`,
                snippet: r.snippet.replace(/<\/?[^>]+(>|$)/g, "") // Strip HTML
            })) || [];

            return { results: results.length > 0 ? results.slice(0, 5) : "No results found." };
        } catch (error: any) {
            console.error("Web search error:", error);
            return { error: "Failed to perform web search." };
        }
    },
});

// --- NEW TOOLS ---

// 4. Web Page Scraper
registerTool({
    name: 'read_page',
    description: 'Fetch and read the text content of a specific web page URL. Use this when the user provides a link and asks for a summary or specific info from it.',
    parameters: z.object({
        url: z.string().url().describe('The full URL of the web page to read'),
    }),
    execute: async ({ url }) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                },
            });

            if (!response.ok) {
                return { error: `Failed to fetch page: ${response.status} ${response.statusText}` };
            }

            const contentType = response.headers.get('content-type') || '';

            // Handle PDF Parsing
            if (contentType.includes('application/pdf') || url.toLowerCase().endsWith('.pdf')) {
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                
                // Dynamically import to bypass Turbopack's static esm resolution errors
                const pdfModule = await import('pdf-parse');
                const parsePdf = (pdfModule as any).default || pdfModule;
                
                const pdfData = await parsePdf(buffer);
                const text = pdfData.text.replace(/\s+/g, ' ').trim().substring(0, 15000);
                return { title: `PDF Document (${pdfData.numpages} pages)`, content: text, info: "PDF extracted successfully. Summarize or extract required info." };
            }

            // Handle Standard HTML
            const html = await response.text();
            const $ = cheerio.load(html);

            // Remove noise
            $('script, style, nav, footer, iframe, ads').remove();

            // Extract main content
            const title = $('title').text().trim();
            const content = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 10000); // Limit to 10k chars

            return { title, content, info: "Content extracted. Summary is recommended." };
        } catch (error: any) {
            console.error("Scraper error:", error);
            return { error: "Failed to scrape the page. It might be blocked, require JS, or be an unsupported format." };
        }
    },
});

// 5. Weather Tool
registerTool({
    name: 'get_weather',
    description: 'Get real-time weather information for a specific location.',
    parameters: z.object({
        location: z.string().describe('The name of the city/location, e.g., "London" or "San Francisco"'),
    }),
    execute: async ({ location }) => {
        try {
            // Using wttr.in for a simple, non-API-key required weather source
            const weatherUrl = `https://wttr.in/${encodeURIComponent(location)}?format=j1`;
            const response = await fetch(weatherUrl);

            if (!response.ok) {
                return { error: "Weather service unavailable." };
            }

            const data = await response.json();
            const current = data.current_condition[0];
            const nearestArea = data.nearest_area[0];

            return {
                location: `${nearestArea.areaName[0].value}, ${nearestArea.country[0].value}`,
                temp_C: current.temp_C,
                condition: current.weatherDesc[0].value,
                humidity: current.humidity,
                wind_speed: current.windspeedKmph,
            };
        } catch (error) {
            console.error("Weather error:", error);
            return { error: "Failed to fetch weather data for this location." };
        }
    },
});

// 6. Search Images (Wikimedia Commons implementation)
registerTool({
    name: 'search_images',
    description: 'Search for existing images on the web. Use this when the user asks to "find" or "search for" photos/images rather than generating them.',
    parameters: z.object({
        query: z.string().describe('The image search query'),
    }),
    execute: async ({ query }, context) => {
        try {
            const imageUrls: string[] = [];
            const lowerQuery = query.toLowerCase();
            const isCollegeQuery = /aliet|loyola|principal|director|mahesh|joji|college|department/i.test(lowerQuery);

            // 1. Search Internal Knowledge base first if related to college
            if (isCollegeQuery) {
                try {
                    // Lower threshold (0.3) for images to be more forgiving with specific queries
                    const docs = await vectorStore.searchDocuments(query, 5, 0.3, undefined, context?.userId);
                    for (const doc of docs) {
                        if (doc.metadata?.images && Array.isArray(doc.metadata.images)) {
                            doc.metadata.images.forEach((img: any) => {
                                if (img.url && !imageUrls.includes(img.url)) {
                                    imageUrls.push(img.url);
                                }
                            });
                        }
                    }
                } catch (e) {
                    console.error("Internal image search error:", e);
                }
            }

            // 2. Search Wikimedia Commons for general images (ONLY if NOT a college query)
            if (!isCollegeQuery) {
                try {
                    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent('filetype:bitmap ' + query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&format=json&origin=*`;
                    const response = await fetch(searchUrl);
                    if (response.ok) {
                        const data = await response.json();
                        const pages = data.query?.pages;
                        if (pages) {
                            for (const id in pages) {
                                if (pages[id].imageinfo?.[0]?.url) {
                                    const url = pages[id].imageinfo[0].url;
                                    if (!imageUrls.includes(url)) imageUrls.push(url);
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error("Wikimedia search error:", e);
                }
            }

            return { images: imageUrls.length > 0 ? imageUrls.slice(0, 10) : "No images found." };
        } catch (error: any) {
            console.error("Image search error:", error);
            return { error: "Failed to search images." };
        }
    },
});

// 6.5 Search Faculty (Structured Database)
registerTool({
    name: 'search_faculty',
    description: 'Search for structured information about ALIET faculty, HODs, and staff. Returns names, designations, qualifications, and profile photos. Use this specifically when asking "Who is...", "List faculty for...", or "HOD of...".',
    parameters: z.object({
        query: z.string().describe('The person name or department to search for (e.g., "CSE" or "Dr. Mahesh")'),
    }),
    execute: async (args: any) => {
        const query = (args.query || args.name || args.search || "").toString().trim();
        let structuredResults = "";
        
        try {
            const supabase = createAdminClient();
            
            // 1. Try Structured Database (Supabase)
            if (query) {
                const { data, error } = await supabase
                    .from('faculty')
                    .select('*')
                    .or(`name.ilike.%${query}%,department.ilike.%${query}%,designation.ilike.%${query}%`)
                    .order('is_hod', { ascending: false })
                    .limit(10);

                if (!error && data && data.length > 0) {
                    structuredResults = data.map((f: any) => {
                        let info = `### ${f.name} (${f.designation})\n`;
                        info += `- Department: ${f.department}\n`;
                        if (f.qualification) info += `- Qualification: ${f.qualification}\n`;
                        if (f.image_url) info += `![${f.name} Profile Photo](${f.image_url})`;
                        return info;
                    }).join('\n\n---\n\n');
                }
            }
        } catch (dbError) {
            console.log(`[SearchFaculty] Database error or unavailable, falling back to static rules...`, dbError);
        }

        // 2. Fallback to Static Rules (Hardcoded) if Database returns nothing/errors
        if (!structuredResults) {
            console.log(`[SearchFaculty] No results in database for "${query}", using static rules fallback...`);
            
            const fuse = new Fuse(FACULTY_RULES, {
                keys: ['keywords'],
                threshold: 0.4,
            });

            const staticResults = query ? fuse.search(query) : [];
            if (staticResults.length > 0) {
                const formatted = staticResults.slice(0, 3).map(r => {
                    return `[FOUND IN STATIC RULES: ${r.item.keywords.join(', ')}]\n${r.item.response}`;
                }).join('\n\n---\n\n');

                return { result: formatted };
            }

            return { result: query ? "No faculty records found in either database or static records. Try search_knowledge for general info." : "Please provide a name or department to search for faculty information." };
        }

        return { result: `[FOUND IN STRUCTURED DATABASE]\n\n${structuredResults}` };
    },
});

// 6.7 Search Faculty Static (Hardcoded Rules) - DEPRECATED: Consistently integrated into search_faculty
/*
registerTool({
    name: 'search_faculty_static',
...
});
*/

// 9. Web Search (DuckDuckGo implementation)
registerTool({
    name: 'web_search',
    description: 'Search the web using DuckDuckGo for general real-time information, current events, news, and live facts.',
    parameters: z.object({
        query: z.string().describe('The search query'),
    }),
    execute: async ({ query }) => {
        try {
            const searchUrl = "https://html.duckduckgo.com/html/";
            const body = new URLSearchParams();
            body.append('q', query);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await fetch(searchUrl, {
                method: 'POST',
                body: body,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                return { error: `Search failed with status ${response.status}` };
            }

            const html = await response.text();
            const $ = cheerio.load(html);
            const results: any[] = [];

            // HTML DuckDuckGo structure parsing
            const links = $('.result__a');
            links.each((i, element) => {
                if (results.length >= 5) return;

                const title = $(element).text().trim();
                const url = $(element).attr('href');
                const snippet = $(element).closest('.result').find('.result__snippet').text().trim();

                if (title && url && snippet) {
                    results.push({ title, url, snippet });
                }
            });

            return { results: results.length > 0 ? results : "No results found." };
        } catch (error: any) {
            console.error("DuckDuckGo search error:", error);
            return { error: "Failed to perform DuckDuckGo search." };
        }
    },
});

// 7. Search Knowledge (RAG)
registerTool({
    name: 'search_knowledge',
    description: 'Search the internal knowledge base for general information about ALIET. For specific questions about PEOPLE, HODs, or STAFF, use `search_faculty` first for better accuracy.',
    parameters: z.object({
        query: z.string().describe('The search query for the knowledge base'),
    }),
    execute: async ({ query }, context) => {
        try {
            let expandedQuery = query;
            if (query.toLowerCase().includes('hod')) {
                expandedQuery += ' Head of Department';
            }
            
            // using top-level import
            // Lower threshold (0.3) for more flexible matching
            // Prioritize documents from the current conversation
            const documents = await vectorStore.searchDocuments(expandedQuery, 5, 0.3, context?.conversationId, context?.userId);
            if (documents.length === 0) {
                return { result: "No relevant documents found in the knowledge base." };
            }
            // Format results for the LLM
            const result = documents.map((doc: any) => {
                const truncatedContent = doc.content.substring(0, 3000);
                let docText = `### [ID: ${doc.id}] SOURCE: ${doc.metadata?.url || 'Internal'}\n${truncatedContent}`;
                
                if (doc.metadata?.images && Array.isArray(doc.metadata.images)) {
                    // Score images based on query keywords
                    const queryWords = query.toLowerCase().split(/\s+/);
                    const scoredImages = doc.metadata.images.map((img: any) => {
                        const alt = (img.alt || '').toLowerCase();
                        const url = (img.url || '').toLowerCase();
                        let score = 0;
                        
                        queryWords.forEach((word: string) => {
                            if (word.length > 3 && (alt.includes(word) || url.includes(word))) score += 3;
                        });
                        
                        if (alt.includes('profile') || alt.includes('photo') || alt.includes('faculty')) score += 2;
                        
                        // Noise check: slides/banners often cause "Failed to load" or are irrelevant
                        const isNoise = alt.includes('slide') || alt.includes('banner') || alt.includes('event') || alt.includes('workshop') || url.includes('/slides/') || url.includes('/banners/');
                        
                        // If it's noise and doesn't have a strong query match, heavily penalize it
                        if (isNoise && score < 3) score -= 10;
                        
                        return { ...img, score };
                    }).filter((img: any) => img.score > -5)
                    .sort((a: any, b: any) => b.score - a.score);

                    // Only pass top 5 images to save tokens, prioritized by relevance
                    const imageList = scoredImages.slice(0, 5).map((img: any) => {
                        const relevance = img.score >= 3 ? " [High Relevance]" : "";
                        return `![${img.alt}${relevance}](${img.url})`;
                    }).join('\n');
                    
                    if (imageList) {
                        docText += `\n\n--- IMAGES FOR THIS SECTION ---\n${imageList}\n------------------------------`;
                    }
                }
                return docText;
            }).join('\n\n---\n\n');
            return { result };
        } catch (error: any) {
            console.error("Knowledge search error:", error);
            return { result: `Error accessing knowledge base: ${error.message || String(error)}. Please check administrative logs or environment configuration.` };
        }
    },
});

// 8. Learn Knowledge (Add to RAG)
registerTool({
    name: 'learn_knowledge',
    description: 'Add new information to the knowledge base. Use this when the user explicitly teaches you something or asks you to remember something.',
    parameters: z.object({
        content: z.string().describe('The content to store in the knowledge base'),
        topic: z.string().optional().describe('Optional topic or category metadata'),
    }),
    execute: async ({ content, topic }, context) => {
        try {
            // using top-level import
            const metadata = topic ? { topic } : {};
            const doc = await vectorStore.addDocument(content, metadata, context?.userId);
            if (doc) {
                return { result: `Successfully added information to knowledge base (ID: ${doc.id}).` };
            }
            return { error: "Failed to add information." };
        } catch (error: any) {
            console.error("Learn knowledge error:", error);
            return { error: "Failed to add to knowledge base." };
        }
    },
});

// 10. Presentation Generator Tool
registerTool({
    name: 'generate_presentation',
    description: 'Generates a professional PowerPoint (.pptx) presentation. REQUIRED ARGS FORMAT: { "title": "Overall Title", "slides": [ { "title": "Detailed Slide Title", "points": ["Fact 1: with detailed explanation", "Fact 2: with detailed explanation", "Fact 3: with detailed explanation"] } ] }. PRO TIP: Be verbose and provide at least 4-5 detailed points per slide to fill the space professionally.',
    parameters: z.object({
        title: z.string().describe('The overall title of the presentation'),
        slides: z.array(z.object({
            title: z.string().describe('Title of the slide'),
            points: z.array(z.string()).describe('Bullet points for the slide'),
        })).describe('Array of slides'),
    }),
    execute: async ({ title, slides }) => {
        try {
            let pptx = new PptxGenJS();
            pptx.layout = 'LAYOUT_16x9';

            // Title Slide
            let titleSlide = pptx.addSlide();
            titleSlide.background = { color: "1A1A1A" };
            titleSlide.addText(title, { x: 0, y: "40%", w: "100%", h: 1, fontSize: 44, color: "FFFFFF", align: "center", bold: true });
            titleSlide.addText("Generated by NextGen AI", { x: 0, y: "60%", w: "100%", h: 1, fontSize: 18, color: "A0A0A0", align: "center" });

            // Content Slides
            const safeSlides = Array.isArray(slides) ? slides : [];
            for (let i = 0; i < safeSlides.length; i++) {
                const slideData = safeSlides[i];
                if (!slideData) continue;
                
                let slide = pptx.addSlide();
                
                // Professional Background (Clean White with subtle Lavender accent)
                slide.background = { color: "F8F9FF" };
                
                // Slide Accent Bar (Premium Look)
                slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.1, fill: { color: "6366F1" } });

                const slideTitle = slideData.title || "Section Details";
                slide.addText(slideTitle, { 
                    x: 0.5, y: 0.4, w: "90%", h: 0.8, 
                    fontSize: 28, bold: true, color: "1E1B4B", 
                    fontFace: "Arial", align: "left",
                    underline: { style: "sng" }
                });
                
                const points = Array.isArray(slideData.points) ? slideData.points : [];
                if (points.length > 0) {
                    // Dynamic Font Sizing based on content density
                    let fontSize = 18;
                    if (points.length <= 3) fontSize = 24;
                    if (points.length > 6) fontSize = 15;

                    const bulletOptions: any = { 
                        x: 0.6, y: 1.4, w: "8.8", h: "75%", 
                        fontSize: fontSize, color: "374151", 
                        bullet: { type: "bullet", code: "2022" }, 
                        margin: 5, lineSpacing: 28,
                        valign: "top"
                    };
                    slide.addText(points.map((p: string) => ({ text: p || "" })), bulletOptions);
                }

                // Footer / Slide Number
                slide.addText(`© NextGen AI | ${title} | Page ${i + 2}`, {
                    x: 0.5, y: 7.1, w: "90%", h: 0.3,
                    fontSize: 10, color: "94A3B8", align: "right"
                });
            }

            const fileName = `generated/presentation_${Date.now()}.pptx`;
            const fullPath = path.join(process.cwd(), 'public', fileName);

            // Ensure directory exists
            if (!fs.existsSync(path.join(process.cwd(), 'public', 'generated'))) {
                fs.mkdirSync(path.join(process.cwd(), 'public', 'generated'), { recursive: true });
            }

            await pptx.writeFile({ fileName: fullPath });

            return {
                success: true,
                downloadUrl: `/${fileName}`,
                result: `Successfully created presentation "${title}". Return this link using markdown so the user can download it: [Download Presentation](/${fileName})`
            };
        } catch (error: any) {
            console.error("Presentation generation error:", error);
            return { error: "Failed to generate the presentation." };
        }
    },
});

// 11. Send Email Tool
registerTool({
    name: 'send_email',
    description: 'Send an email to a requested email address. REQUIRED ARGS FORMAT: { "to_email": "...", "subject": "...", "content": "..." }',
    parameters: z.object({
        to_email: z.string().email().describe('The recipient email address'),
        subject: z.string().describe('The subject of the email'),
        content: z.string().describe('The HTML or standard text format body of the email'),
    }),
    execute: async ({ to_email, subject, content }) => {
        try {
            if (!process.env.RESEND_API_KEY) {
                return { error: "Resend API key is not configured in environment variables." };
            }

            const resend = new Resend(process.env.RESEND_API_KEY);
            // Defaulting to an allowed Resend domain address. Free tier requires sending to verified addresses or using 'onboarding@resend.dev'
            const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

            const { data, error } = await resend.emails.send({
                from: `NextGen AI <${fromEmail}>`,
                to: [to_email],
                subject: subject,
                html: `<div>${content.replace(/\\n/g, '<br/>')}</div>`,
            });

            if (error) {
                throw error;
            }

            return { success: true, result: `Email sent successfully to ${to_email} (ID: ${data?.id})` };
        } catch (error: any) {
            console.error("Email send error:", error);
            return { error: `Failed to send email: ${error.message || String(error)}` };
        }
    },
});

// --- MASSIVE PDF GENERATOR SUITE ---

const PDF_DRAFTS_PATH = path.join(process.cwd(), 'public', 'generated', 'pdf_drafts.json');

function getPdfDrafts() {
    if (!fs.existsSync(PDF_DRAFTS_PATH)) return {};
    try {
        return JSON.parse(fs.readFileSync(PDF_DRAFTS_PATH, 'utf8'));
    } catch (e) {
        return {};
    }
}

function savePdfDrafts(drafts: any) {
    const dir = path.dirname(PDF_DRAFTS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(PDF_DRAFTS_PATH, JSON.stringify(drafts, null, 2));
}

// 12. Start PDF Tool
registerTool({
    name: 'start_pdf',
    description: 'Initialize a new multi-page PDF draft. Use this when starting a long report or book. REQUIRED ARGS: { "title": "...", "author": "..." }',
    parameters: z.object({
        title: z.string().describe('The title of the document'),
        author: z.string().describe('The author of the document'),
    }),
    execute: async ({ title, author }, context) => {
        const drafts = getPdfDrafts();
        const id = context?.conversationId || 'default';
        
        drafts[id] = {
            title,
            author,
            sections: [],
            createdAt: new Date().toISOString()
        };
        
        savePdfDrafts(drafts);
        return { success: true, message: `Started PDF draft: "${title}". You can now use append_pdf_content to add chapters.` };
    },
});

// 13. Append PDF Content Tool
registerTool({
    name: 'append_pdf_content',
    description: 'Append a new section/chapter to the current PDF draft. Use this iteratively for long documents. REQUIRED ARGS: { "header": "...", "content": "..." }',
    parameters: z.object({
        header: z.string().describe('The header or chapter title for this section'),
        content: z.string().describe('The long-form text content for this section (markdown supported for basic formatting)'),
    }),
    execute: async ({ header, content }, context) => {
        const drafts = getPdfDrafts();
        const id = context?.conversationId || 'default';
        
        if (!drafts[id]) {
            return { error: "No active PDF draft found. Use start_pdf first." };
        }
        
        drafts[id].sections.push({ header, content });
        savePdfDrafts(drafts);
        
        return { success: true, message: `Added section "${header}" to the draft. Total sections: ${drafts[id].sections.length}.` };
    },
});

// 14. Finish PDF Tool
registerTool({
    name: 'finish_pdf',
    description: 'Compile and generate the final PDF file from all appended sections. Returns a download link. REQUIRED ARGS: {}',
    parameters: z.object({}),
    execute: async (_, context) => {
        const drafts = getPdfDrafts();
        const id = context?.conversationId || 'default';
        
        const draft = drafts[id];
        if (!draft || draft.sections.length === 0) {
            return { error: "No content to generate. Start a draft and append content first." };
        }
        
        try {
            const doc = new PDFDocument({ margin: 50 });
            const fileName = `generated/book_${Date.now()}.pdf`;
            const fullPath = path.join(process.cwd(), 'public', fileName);
            
            const stream = fs.createWriteStream(fullPath);
            doc.pipe(stream);
            
            // Title Page
            doc.fontSize(36).text(draft.title, { align: 'center' });
            doc.moveDown();
            doc.fontSize(18).text(`By ${draft.author}`, { align: 'center' });
            doc.moveDown(4);
            doc.fontSize(12).text(`Generated on ${new Date().toLocaleDateString()}`, { align: 'center' });
            
            // Content Sections
            for (const section of draft.sections) {
                doc.addPage();
                doc.fontSize(24).text(section.header, { underline: true });
                doc.moveDown();
                doc.fontSize(12).text(section.content, { align: 'justify', lineGap: 5 });
            }
            
            doc.end();
            
            // Wait for stream to finish
            await new Promise<void>((resolve) => stream.on('finish', () => resolve()));
            
            // Cleanup draft
            delete drafts[id];
            savePdfDrafts(drafts);
            
            return {
                success: true,
                downloadUrl: `/${fileName}`,
                result: `Successfully generated ${draft.title}. Download link: [Download PDF](/${fileName})`
            };
        } catch (error: any) {
            console.error("PDF generation error:", error);
            return { error: "Failed to compile PDF." };
        }
    },
});

export function getToolDefinitions() {
    return Object.values(toolRegistry).map(tool => ({
        name: tool.name,
        description: tool.description,
        // parameters would be converted to JSON Schema here for the LLM
        // Simplified for this architecture step
        parameters: tool.parameters,
    }));
}
