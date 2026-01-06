import { z } from 'zod';

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
        // Safety: In a real app, use a safer math parser like mathjs. 
        // For this demo, we'll keep it simple but restricted.
        try {
            // Basic sanitization
            if (/[^0-9+\-*/(). ]/.test(expression)) {
                return "Error: Invalid characters in expression.";
            }
            // eslint-disable-next-line no-eval
            const result = eval(expression);
            return { result };
        } catch (e) {
            return { error: 'Failed to evaluate expression' };
        }
    },
});

// 2. Web Search (Mock for high-performance automation demo)
registerTool({
    name: 'web_search',
    description: 'Search the web for real-time information.',
    parameters: z.object({
        query: z.string().describe('The search query'),
    }),
    execute: async ({ query }) => {
        // Mocking a high-performance search API response
        // In production, connect this to Tavily or Google Search API
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
        return {
            results: [
                { title: `${query} - Official Docs`, snippet: `Detailed documentation about ${query}...`, url: 'https://example.com/docs' },
                { title: `Latest news on ${query}`, snippet: `Breaking changes in the recent version of ${query}...`, url: 'https://example.com/news' }
            ]
        };
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
