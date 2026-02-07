import { toolRegistry } from './registry';
import { model } from '@/lib/gemini';

interface AgentResponse {
    type: 'text' | 'tool_call' | 'error';
    content?: string;
    toolName?: string;
    toolArgs?: any;
}

export async function runAgentWorkflow(history: any[], message: string, images: any[] = []) {
    // 1. Prepare Context (High-Performance Context Pruning could go here)
    // For now, we take the last 10 messages for speed
    let recentHistory = history.slice(-10).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
    }));

    // Gemini API Requirement: First message must be from 'user'
    while (recentHistory.length > 0 && recentHistory[0].role === 'model') {
        recentHistory.shift();
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
        generationConfig: {
            maxOutputTokens: 1000,
        },
    });

    // 2. Initial Prompt with Tool Instructions
    // In a real high-performance setup, we would fine-tune or use specific tool-use models.
    // Here we use a system-prompt injection technique for standard Gemini Pro.
    const toolsPrompt = `
You are an advanced AI assistant with access to the following tools:
${Object.values(toolRegistry).map(t => `- ${t.name}: ${t.description}`).join('\n')}

If you need to use a tool, respond ONLY with a JSON object in this format:
{ "tool": "tool_name", "args": { ... } }

If no tool is needed, simply respond with the text answer.

IMPORTANT: If you use the 'generate_image' or 'search_images' tool, you MUST include the returned 'imageUrl' (or 'images' array) in your final response using Markdown image syntax: ![Generated Image](imageUrl) or for search results: ![Image 1](url1) ![Image 2](url2).

NOTE: If the user asks for an image of a **specific real person, celebrity, or public figure** (e.g., "Virat Kohli", "Elon Musk"), expected behaviour is to FIND existing photos using the 'search_images' tool. The image generation model will likely refuse to generate real people due to safety filters. Only use 'generate_image' if the user explicitly asks for "art", a "painting", or a "drawing" of the person, or if the subject is fictional/generic.
`;

    // 3. Send Message
    // Combine text prompt and images
    const messageParts = [
        { text: toolsPrompt + "\nUser: " + message },
        ...imageParts
    ];

    const result = await chat.sendMessage(messageParts);
    const responseText = result.response.text();

    // 4. Parse for Tool Calls
    try {
        // Attempt to find JSON in the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const potentialJson = JSON.parse(jsonMatch[0]);
            if (potentialJson.tool && toolRegistry[potentialJson.tool]) {
                return {
                    type: 'tool_call',
                    toolName: potentialJson.tool,
                    toolArgs: potentialJson.args
                };
            }
        }
    } catch (e) {
        // Not valid JSON, treat as text
    }

    return { type: 'text', content: responseText };
}

export async function executeToolCall(toolName: string, args: any) {
    const tool = toolRegistry[toolName];
    if (!tool) throw new Error(`Tool ${toolName} not found`);

    console.log(`[Agent] Executing ${toolName} with`, args);
    return await tool.execute(args);
}
