import { toolRegistry } from './registry';
import { getDynamicModel } from '@/lib/gemini';

interface AgentResponse {
    type: 'text' | 'tool_call' | 'error';
    content?: string;
    toolName?: string;
    toolArgs?: any;
}

export async function runAgentWorkflow(history: any[], message: string, images: any[] = [], persona?: string, modelId?: string) {
    // 1. Prepare Context (High-Performance Context Pruning)
    // Take a larger slice but filter for relevance or alternating structure.
    // For now, take last 14 messages, but make sure we maintain conversation flow
    let recentHistory = history.slice(-14).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
    }));

    // Gemini API Requirement: First message must be from 'user'
    while (recentHistory.length > 0 && recentHistory[0].role === 'model') {
        recentHistory.shift();
    }

    // Gemini API Requirement: Roles must alternate (user -> model -> user)
    // We filter out consecutive duplicate roles by combining their text
    const cleanHistory: any[] = [];
    for (const msg of recentHistory) {
        if (cleanHistory.length === 0 || cleanHistory[cleanHistory.length - 1].role !== msg.role) {
            cleanHistory.push(msg);
        } else {
            // Append text to the previous message of the same role
            cleanHistory[cleanHistory.length - 1].parts[0].text += `\n\n${msg.parts[0].text}`;
        }
    }
    recentHistory = cleanHistory;


    // Convert images to Gemini format
    const imageParts = images.map(img => ({
        inlineData: {
            data: img.data,
            mimeType: img.mimeType
        }
    }));

    const dynamicModel = getDynamicModel(modelId || 'gemini-1.5-flash');
    const chat = dynamicModel.startChat({
        history: recentHistory,
        generationConfig: {
            maxOutputTokens: 1000,
        },
    });

    // 2. Initial Prompt with Tool Instructions
    const toolsPrompt = `
You are an advanced AI assistant with access to tools. 

If you need to use a tool, you MUST respond ONLY with a JSON object. Do not include any other text BEFORE or AFTER the JSON.
Format: { "tool": "tool_name", "args": { ... } }

Available Tools:
${Object.values(toolRegistry).map(t => `- ${t.name}: ${t.description}`).join('\n')}

- If no tool is needed, respond with a direct text answer.
- If search_knowledge returns nothing, use your general knowledge but mention the search was empty.
- Always use Markdown lists (\`- \` or \`1. \`) for structured info.

${persona ? `\n--- PERSONA ---\n${persona}\n---------------` : ''}
`;

    // 3. Send Message
    const messageParts = [
        { text: toolsPrompt + "\nUser: " + message },
        ...imageParts
    ];

    const result = await chat.sendMessage(messageParts);
    const responseText = result.response.text();

    // 4. Robust JSON Parsing (Handles Markdown blocks, preamble, and noise)
    try {
        // Find the first opening brace and the last closing brace to extract the JSON object
        const firstBrace = responseText.indexOf('{');
        const lastBrace = responseText.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const potentialJsonStr = responseText.substring(firstBrace, lastBrace + 1);
            const parsed = JSON.parse(potentialJsonStr);

            if (parsed.tool && typeof parsed.tool === 'string') {
                // Verify the tool actually exists in the registry to prevent hallucinated tools
                if (toolRegistry[parsed.tool]) {
                    return {
                        type: 'tool_call',
                        toolName: parsed.tool,
                        toolArgs: parsed.args || {}
                    };
                } else {
                    console.warn(`[Agent] Hallucinated tool call detected: ${parsed.tool}`);
                }
            }
        }
    } catch (e) {
        console.warn(`[Agent] Failed to parse potential tool call: ${e}`);
        // Fall through to text if parsing fails (it might just be a normal text response with a brace in it)
    }


    return { type: 'text', content: responseText };
}

export async function executeToolCall(toolName: string, args: any) {
    const tool = toolRegistry[toolName];
    if (!tool) throw new Error(`Tool ${toolName} not found`);

    console.log(`[Agent] Executing ${toolName} with`, args);
    return await tool.execute(args);
}
