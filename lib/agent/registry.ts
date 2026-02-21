import { z } from 'zod';
import * as cheerio from 'cheerio';
import * as vectorStore from '../vector-store';

export interface Tool {
    name: string;
    description: string;
    parameters: z.ZodObject<any>;
    execute: (args: any) => Promise<any>;
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
            // Strict sanitization: only allow digits, operators, parentheses, dots, and spaces
            if (/[^0-9+\-*/(). ]/.test(expression)) {
                return { error: "Invalid characters in expression." };
            }
            // Safe evaluation using Function constructor (no access to scope)
            const result = new Function(`"use strict"; return (${expression})`)();
            if (typeof result !== 'number' || !isFinite(result)) {
                return { error: 'Expression did not produce a valid number.' };
            }
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
        const apiKey = process.env.POLLINATIONS_API_KEY;
        if (!apiKey) {
            return { error: 'Image generation is not configured.' };
        }
        // Enhance prompt for realism
        const enhancedPrompt = `${prompt}, photorealistic, 4k, highly detailed, cinematic lighting, hd, raw photo`;
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        const seed = Math.floor(Math.random() * 1000000);
        const keyParam = `&key=${apiKey}`;
        // Use flux-realism model for better results
        const imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux-realism&nologo=true${keyParam}`;
        return { imageUrl, info: "Image generated successfully. Embed this URL in markdown." };
    },
});

// 3. Web Search (Scraping implementation)
registerTool({
    name: 'web_search',
    description: 'Search the web for real-time information. Use this to find news, facts, and general info.',
    parameters: z.object({
        query: z.string().describe('The search query'),
    }),
    execute: async ({ query }) => {
        try {
            // Cheerio is imported at the top level
            const searchUrl = "https://html.duckduckgo.com/html/";
            const body = new URLSearchParams();
            body.append('q', query);

            // Add a timeout signal to prevent long hangs
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

            if (results.length === 0) {
                // Fallback for different HTML structure
                const rows = $('table').last().find('tr');
                rows.each((i: number, element: any) => {
                    if (results.length >= 5) return;
                    const linkAnchor = $(element).find('a.result-link');
                    if (linkAnchor.length > 0) {
                        const title = linkAnchor.text().trim();
                        const url = linkAnchor.attr('href');
                        const snippet = $(element).find('.result-snippet').text().trim();
                        if (title && url) {
                            results.push({ title, url, snippet });
                        }
                    }
                });
            }

            return { results: results.length > 0 ? results : "No results found." };
        } catch (error: any) {
            console.error("Web search error:", error);
            // Return specific error so the Agent knows to fall back
            return { error: "Failed to perform web search." };
        }
    },
});

// 4. Search Images (Scraping implementation)
registerTool({
    name: 'search_images',
    description: 'Search for existing images on the web. Use this when the user asks to "find" or "search for" photos/images rather than generating them.',
    parameters: z.object({
        query: z.string().describe('The image search query'),
    }),
    execute: async ({ query }) => {
        try {
            const imageUrls: string[] = [];

            const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`;
            const gRes = await fetch(googleUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const gHtml = await gRes.text();
            const $g = cheerio.load(gHtml);

            // Google obfuscates classes. Look for 'img' tags effectively.
            $g('img').each((i: number, el: any) => {
                if (imageUrls.length >= 5) return;
                const src = $g(el).attr('src');
                if (src && src.startsWith('http')) {
                    imageUrls.push(src);
                }
            });

            if (imageUrls.length > 0) {
                return { images: imageUrls };
            }

            return { error: "No images found." };

        } catch (error: any) {
            console.error("Image search error:", error);
            return { error: "Failed to search images." };
        }
    },
});

// 5. Search Knowledge (RAG)
registerTool({
    name: 'search_knowledge',
    description: 'Search the internal knowledge base for documents. Use this when the user asks about specific stored information.',
    parameters: z.object({
        query: z.string().describe('The search query for the knowledge base'),
    }),
    execute: async ({ query }) => {
        try {
            // using top-level import
            const documents = await vectorStore.searchDocuments(query);
            if (documents.length === 0) {
                return { result: "No relevant documents found in the knowledge base." };
            }
            // Format results for the LLM
            const result = documents.map((doc: any) => `[ID: ${doc.id}]\n${doc.content}`).join('\n\n');
            return { result };
        } catch (error: any) {
            console.error("Knowledge search error:", error);
            return { result: `Error accessing knowledge base: ${error.message || String(error)}. Please check administrative logs or environment configuration.` };
        }
    },
});

// 6. Learn Knowledge (Add to RAG)
registerTool({
    name: 'learn_knowledge',
    description: 'Add new information to the knowledge base. Use this when the user explicitly teaches you something or asks you to remember something.',
    parameters: z.object({
        content: z.string().describe('The content to store in the knowledge base'),
        topic: z.string().optional().describe('Optional topic or category metadata'),
    }),
    execute: async ({ content, topic }) => {
        try {
            // using top-level import
            const metadata = topic ? { topic } : {};
            const doc = await vectorStore.addDocument(content, metadata);
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
