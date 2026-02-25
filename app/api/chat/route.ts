import { NextRequest, NextResponse } from 'next/server';
import { runAgentWorkflow, executeToolCall } from '@/lib/agent/workflow-engine';
import { createClient } from '@/lib/supabase/server';
import { Cache } from '@/lib/cache';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const { history, message, layers, persona, modelId } = await req.json();

        // Identify User for RAG Context
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;

        // High-Performance Optimization: Context-Aware Cache
        // Include history length to prevent serving cached first-turn answers on follow-up questions
        const historyLength = Array.isArray(history) ? history.length : 0;
        const cacheKey = `query:${historyLength}:${message}:${persona || 'std'}:${modelId || 'flash'}`;

        // Skip cache if there are images, as context differs
        const cachedResponse = (!layers || layers.length === 0) ? Cache.get(cacheKey) : null;

        if (cachedResponse) {
            // Speed! Return cached response immediately.
            return new NextResponse(new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode(cachedResponse));
                    controller.close();
                }
            }));
        }

        // Agent Execution Loop
        // 1. Initial Plan/Thought
        // We pass 'history' here, but for the loop we need the accumulated context
        // Create a custom stream to send intermediate thoughts and final results
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                const sendChunk = (text: string) => controller.enqueue(encoder.encode(text));

                try {
                    // 1. Initial Planned Action
                    sendChunk("__AGENT_ACTION__:Initializing workflow...\n");

                    let response = await runAgentWorkflow(history, message, layers, persona, modelId, userId);

                    // 2. Agent Execution Loop with Tool Streaming
                    const workingHistory = [...history];
                    workingHistory.push({ role: 'user', content: message });

                    let depth = 0;
                    while (response.type === 'tool_call' && depth < 3) {
                        const { toolName, toolArgs } = response;

                        // Stream the action to the user
                        let statusText = `Using tool: ${toolName}`;
                        if (toolName === 'web_search') statusText = `Searching the web for "${toolArgs.query}"...`;
                        if (toolName === 'search_knowledge') statusText = `Searching internal documents for info...`;
                        if (toolName === 'generate_image') statusText = `Generating image for "${toolArgs.prompt}"...`;
                        if (toolName === 'calculate') statusText = `Calculating: ${toolArgs.expression}`;

                        sendChunk(`__AGENT_ACTION__:${statusText}\n`);

                        // Execute Tool
                        const toolResult = await executeToolCall(toolName!, toolArgs, userId);

                        // Feed back to history
                        workingHistory.push({ role: 'model', content: `Requesting tool: ${toolName}` });
                        workingHistory.push({ role: 'user', content: `Tool Result for ${toolName}: ${JSON.stringify(toolResult)}` });

                        // Re-run Agent
                        sendChunk(`__AGENT_ACTION__:Analyzing results from ${toolName}...\n`);
                        response = await runAgentWorkflow(workingHistory, "Continue based on the tool result.", [], persona, modelId, userId);
                        depth++;
                    }

                    // 3. Final Output
                    let finalContent = "";
                    if (response.type === 'text') {
                        finalContent = response.content || "";
                        Cache.set(cacheKey, finalContent, 60);
                    } else if (response.type === 'tool_call') {
                        finalContent = "I apologize, but I reached a complexity limit while processing your request with tools.";
                    }

                    if (!finalContent.trim()) {
                        finalContent = "I apologize, but I encountered an issue generating a response.";
                    }

                    // Send final content (clears the action state in frontend)
                    sendChunk(finalContent);
                    controller.close();

                } catch (err: any) {
                    console.error('[Stream Processing Error]:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
                    try {
                        sendChunk(`Error: ${err.message || 'An unexpected error occurred during processing.'}`);
                        controller.close();
                    } catch (closeErr) {
                        console.error('[Stream Close Error]: Could not cleanly close stream after error.', closeErr);
                    }
                }
            }
        });

        return new NextResponse(stream);


    } catch (error: any) {
        // Improved logging to catch Error objects which stringify to {}
        console.error('Error processing chat:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        return NextResponse.json(
            { error: error.message || String(error) || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
