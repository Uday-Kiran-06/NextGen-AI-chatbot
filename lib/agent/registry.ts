import { z } from 'zod';
import * as cheerio from 'cheerio';
import * as vectorStore from '../vector-store';
import { createAdminClient } from '../supabase/admin';
import { FACULTY_RULES } from '../faculty-rules';
import Fuse from 'fuse.js';

export interface Tool {
    name: string;
    description: string;
    parameters: z.ZodObject<any>;
    execute: (args: any, context?: { userId?: string }) => Promise<any>;
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
        // Safety: In a real app, use a safer math parser like mathjs. 
        // For this demo, we'll keep it simple but restricted.
        try {
            // Basic sanitization
            if (/[^0-9+\-*/(). ]/.test(expression)) {
                return "Error: Invalid characters in expression.";
            }

            const result = eval(expression);
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

// 3. Web Search (Wikipedia implementation)
registerTool({
    name: 'web_search',
    description: 'Search Wikipedia for reliable information. Use this to find news, facts, and general info.',
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
            return { error: "Failed to scrape the page. It might be blocked or require JS." };
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
                    const results = data.map((f: any) => {
                        let info = `### ${f.name} (${f.designation})\n`;
                        info += `- Department: ${f.department}\n`;
                        if (f.qualification) info += `- Qualification: ${f.qualification}\n`;
                        if (f.image_url) info += `![${f.name} Profile Photo](${f.image_url})`;
                        return info;
                    }).join('\n\n---\n\n');

                    return { result: `[FOUND IN STRUCTURED DATABASE]\n\n${results}` };
                }
            }

            // 2. Fallback to Static Rules (Hardcoded) if Database returns nothing or errors
            console.log(`[SearchFaculty] No results in database for "${query}", falling back to static rules...`);
            
            const fuse = new Fuse(FACULTY_RULES, {
                keys: ['keywords'],
                threshold: 0.4,
            });

            // Ensure we don't pass undefined/null to fuse.search
            const staticResults = query ? fuse.search(query) : [];
            if (staticResults.length > 0) {
                const formatted = staticResults.slice(0, 3).map(r => {
                    return `[FOUND IN STATIC RULES: ${r.item.keywords.join(', ')}]\n${r.item.response}`;
                }).join('\n\n---\n\n');

                return { result: formatted };
            }

            return { result: query ? "No faculty records found in either database or static records. Try search_knowledge for general info." : "Please provide a name or department to search for faculty information." };
        } catch (error: any) {
            console.error("Faculty search error:", error, "Original Args:", args);
            return { error: "Failed to search faculty database." };
        }
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
    name: 'duckduckgo_search',
    description: 'Search the web using DuckDuckGo for general real-time information, news, and facts.',
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
            const documents = await vectorStore.searchDocuments(expandedQuery, 5, 0.3, undefined, context?.userId);
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

export function getToolDefinitions() {
    return Object.values(toolRegistry).map(tool => ({
        name: tool.name,
        description: tool.description,
        // parameters would be converted to JSON Schema here for the LLM
        // Simplified for this architecture step
        parameters: tool.parameters,
    }));
}
