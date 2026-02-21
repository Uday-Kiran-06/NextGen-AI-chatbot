import { toolRegistry } from './registry';
import { model } from '@/lib/gemini';
import { FunctionDeclaration, SchemaType } from '@google/generative-ai';

// Define tools for Gemini
const geminiTools = [{
    functionDeclarations: [
        {
            name: 'calculate',
            description: 'Perform a mathematical calculation. Use this for precise math.',
            parameters: { type: SchemaType.OBJECT, properties: { expression: { type: SchemaType.STRING, description: 'The mathematical expression to evaluate' } }, required: ['expression'] }
        },
        {
            name: 'generate_image',
            description: 'Generate an image based on a text prompt.',
            parameters: { type: SchemaType.OBJECT, properties: { prompt: { type: SchemaType.STRING, description: 'The detailed visual description of the image to generate' } }, required: ['prompt'] }
        },
        {
            name: 'web_search',
            description: 'Search the web for real-time information. Use this to find news, facts, and general info.',
            parameters: { type: SchemaType.OBJECT, properties: { query: { type: SchemaType.STRING, description: 'The search query' } }, required: ['query'] }
        },
        {
            name: 'search_images',
            description: 'Search for existing images on the web. Use this when the user asks to "find" or "search for" photos/images.',
            parameters: { type: SchemaType.OBJECT, properties: { query: { type: SchemaType.STRING, description: 'The image search query' } }, required: ['query'] }
        },
        {
            name: 'search_knowledge',
            description: 'Search the internal knowledge base for documents. Use this when the user asks about specific stored information.',
            parameters: { type: SchemaType.OBJECT, properties: { query: { type: SchemaType.STRING, description: 'The search query for the knowledge base' } }, required: ['query'] }
        },
        {
            name: 'learn_knowledge',
            description: 'Add new information to the knowledge base.',
            parameters: { type: SchemaType.OBJECT, properties: { content: { type: SchemaType.STRING, description: 'The content to store' }, topic: { type: SchemaType.STRING, description: 'Optional topic metadata' } }, required: ['content'] }
        }
    ] as FunctionDeclaration[]
}];

interface AgentResponse {
    type: 'text' | 'tool_call' | 'error';
    content?: string;
    toolName?: string;
    toolArgs?: any;
}

export async function runAgentWorkflow(history: any[], message: string, images: any[] = []) {
    // 1. Prepare Context
    // For now, we take the last 10 messages for speed
    let recentHistory = history.slice(-10).map(msg => ({
        role: (msg.role === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: msg.content }],
    }));

    // Consolidate adjacent roles to strictly satisfy Gemini API constraints
    const normalizedHistory: { role: 'user' | 'model', parts: any[] }[] = [];
    for (const msg of recentHistory) {
        if (normalizedHistory.length > 0 && normalizedHistory[normalizedHistory.length - 1].role === msg.role) {
            normalizedHistory[normalizedHistory.length - 1].parts[0].text += '\n\n' + msg.parts[0].text;
        } else {
            normalizedHistory.push(msg);
        }
    }

    // Gemini API Requirement: First message must be from 'user'
    while (normalizedHistory.length > 0 && normalizedHistory[0].role === 'model') {
        normalizedHistory.shift();
    }

    // Gemini API Requirement: The history passed to startChat must end with a 'model' role
    // because chat.sendMessage() will append a 'user' role automatically.
    if (normalizedHistory.length > 0 && normalizedHistory[normalizedHistory.length - 1].role === 'user') {
        // Dummy acknowledgement to preserve the alternating sequence
        normalizedHistory.push({ role: 'model', parts: [{ text: 'Acknowledged input.' }] });
    }

    // Convert images to Gemini format
    const imageParts = images.map(img => ({
        inlineData: {
            data: img.data,
            mimeType: img.mimeType
        }
    }));

    const chat = model.startChat({
        history: recentHistory,
        generationConfig: { maxOutputTokens: 2000 },
        tools: geminiTools
    });

    const systemInstruction = `
IMPORTANT: If you use 'generate_image' or 'search_images', you MUST include the returned imageUrl or images array in your final text response using Markdown image syntax: ![Generated Image](imageUrl).
CRITICAL FALLBACK: If a tool returns "no results" or fails, states that briefly and fallback to your general knowledge to answer. NEVER ask for clarification if you have a reasonable guess.
NOTE: For real celebrities/public figures, ALWAYS use 'search_images' instead of 'generate_image' to avoid safety filters.
`;

    // 3. Send Message
    const messageParts = [
        { text: systemInstruction + "\nUser: " + message },
        ...imageParts
    ];

    const result = await chat.sendMessage(messageParts);
    const response = result.response;
    
    // 4. Native Tool Call Parsing
    const functionCalls = response.functionCalls();
    
    if (functionCalls && functionCalls.length > 0) {
        // Native tool call found
        const call = functionCalls[0];
        if (toolRegistry[call.name]) {
            return {
                type: 'tool_call',
                toolName: call.name,
                toolArgs: call.args
            };
        }
    }

    const responseText = response.text();

    return { type: 'text', content: responseText };
}

export async function executeToolCall(toolName: string, args: any) {
    const tool = toolRegistry[toolName];
    if (!tool) throw new Error(`Tool ${toolName} not found`);

    console.log(`[Agent] Executing ${toolName} with`, args);
    return await tool.execute(args);
}
