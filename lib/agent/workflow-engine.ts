import { toolRegistry } from './registry';
import { getDynamicModel } from '@/lib/gemini';
import { checkRules } from '@/lib/rules';
import { callGroq } from '@/lib/groq';
import { callOllama } from '@/lib/ollama';

interface AgentResponse {
    type: 'text' | 'tool_call' | 'error';
    content?: string;
    toolName?: string;
    toolArgs?: any;
}

export async function runAgentWorkflow(history: any[], message: string, images: any[] = [], persona?: string, modelId?: string, userId?: string, useWebSearch?: boolean) {
    // 0. Tier-1 Rules Engine (Instant Response)
    // Only apply for simple text messages without images
    if (images.length === 0) {
        const ruleMatch = await checkRules(message);
        if (ruleMatch) {
            return { type: 'text', content: ruleMatch };
        }
    }

    // 1. Prepare Context & Route
    const isGroq = modelId?.startsWith('llama') || modelId?.startsWith('mixtral');
    const isOllama = modelId?.startsWith('ollama');
    const now = new Date();
    const dateTimeContext = `Current Date and Time: ${now.toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})\n`;

    if (isGroq || isOllama) {
        // Groq / OpenAI Format
        const formatMessages = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));

        // Add Persona and Date/Time as system message
        const systemPrompt = (persona ? `PERSONA: ${persona}\n` : '') + dateTimeContext + (useWebSearch ? "\nUSER REQUESTED WEB SEARCH: You MUST use the `duckduckgo_search` or `read_page` tool to gather real-time information before responding." : "");
        formatMessages.unshift({ role: 'system', content: systemPrompt });

        formatMessages.push({ role: 'user', content: message });

        try {
            let content = "";
            if (isOllama) {
                content = await callOllama(formatMessages, modelId!);
            } else {
                content = await callGroq(formatMessages, modelId);
            }
            return { type: 'text', content };
        } catch (error: any) {
            console.error('[OpenSource Workflow Error]:', error);
            return { type: 'text', content: `Error from Model Provider: ${error.message}` };
        }
    }

    // --- Gemini Path (Existing) ---
    // High-Performance Context Pruning
    let recentHistory = history.slice(-14).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
    }));

    // Gemini API Requirement: First message must be from 'user'
    while (recentHistory.length > 0 && recentHistory[0].role === 'model') {
        recentHistory.shift();
    }

    // Gemini API Requirement: Roles must alternate
    const cleanHistory: any[] = [];
    for (const msg of recentHistory) {
        if (cleanHistory.length === 0 || cleanHistory[cleanHistory.length - 1].role !== msg.role) {
            cleanHistory.push(msg);
        } else {
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

${dateTimeContext}

If you need to use a tool, you MUST respond ONLY with a JSON object. Do not include any other text BEFORE or AFTER the JSON.
Format: { "tool": "tool_name", "args": { ... } }

Available Tools:
${Object.values(toolRegistry).map(t => `- ${t.name}: ${t.description}`).join('\n')}

- If no tool is needed, respond with a direct text answer.
- If search_knowledge returns nothing, use your general knowledge but mention the search was empty.
- Always use Markdown lists (\`- \` or \`1. \`) for structured info.
- Use emojis naturally to make your generated responses more attractive and readable!

${useWebSearch ? "\nCRITICAL: USER EXPLICITLY REQUESTED WEB SEARCH. You MUST use the `duckduckgo_search` or `web_search` or `read_page` tool to gather real-time data before providing your final answer.\n" : ""}
${persona ? `\n--- PERSONA ---\n${persona}\n---------------` : ''}
`;

    // 3. Send Message
    const messageParts = [
        { text: toolsPrompt + "\nUser: " + message },
        ...imageParts
    ];

    const result = await chat.sendMessage(messageParts);
    const responseText = result.response.text();

    // 4. Robust JSON Parsing
    try {
        const firstBrace = responseText.indexOf('{');
        const lastBrace = responseText.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const potentialJsonStr = responseText.substring(firstBrace, lastBrace + 1);
            const parsed = JSON.parse(potentialJsonStr);

            if (parsed.tool && typeof parsed.tool === 'string') {
                if (toolRegistry[parsed.tool]) {
                    return {
                        type: 'tool_call',
                        toolName: parsed.tool,
                        toolArgs: parsed.args || {}
                    };
                }
            }
        }
    } catch (e) {
        console.warn(`[Agent] Failed to parse potential tool call: ${e}`);
    }

    return { type: 'text', content: responseText };
}

export async function executeToolCall(toolName: string, args: any, userId?: string) {
    const tool = toolRegistry[toolName];
    if (!tool) throw new Error(`Tool ${toolName} not found`);

    console.log(`[Agent] Executing ${toolName} with`, args, "for user", userId);
    return await tool.execute(args, { userId });
}
