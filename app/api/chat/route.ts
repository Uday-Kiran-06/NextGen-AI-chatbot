
import { NextRequest, NextResponse } from 'next/server';
import { runAgentWorkflow, executeToolCall } from '@/lib/agent/workflow-engine';
import { Cache } from '@/lib/cache';

export async function POST(req: NextRequest) {
    try {
        const { history, message, layers } = await req.json();

        // High-Performance Optimization: Check Cache for identical queries
        // (Simplified key generation for demo - in prod use hash)
        const cacheKey = `query:${message}`;
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
        let response = await runAgentWorkflow(history, message, layers);

        // 2. Loop if tool calls are needed
        // (Limit depth to 3 for safety in this demo)
        let depth = 0;
        let finalContent = "";

        // CRITICAL FIX: Ensure the original message is in history for the loop
        // If history doesn't contain the last user message, the agent forgets the question
        // when processing tool results. Use a fresh copy for mutable operations.
        const workingHistory = [...history];
        workingHistory.push({ role: 'user', content: message });

        while (response.type === 'tool_call' && depth < 3) {
            const { toolName, toolArgs } = response;

            // Execute Tool
            const toolResult = await executeToolCall(toolName!, toolArgs);

            // Add tool result to history conceptually
            // In Gemini API, we'd send a "function_response" part.
            // For this simpler "chat" abstraction, we feed it back as system info.
            workingHistory.push({ role: 'model', content: `Requesting tool: ${toolName}` });
            workingHistory.push({ role: 'user', content: `Tool Result for ${toolName}: ${JSON.stringify(toolResult)}` });

            // Re-run Agent with new context
            // Pass EMPTY message because the real question is now in workingHistory
            response = await runAgentWorkflow(workingHistory, "Continue based on the tool result.");
            depth++;
        }

        if (response.type === 'text') {
            finalContent = response.content || "";
            // Cache the final result for short duration
            Cache.set(cacheKey, finalContent, 60);
        }

        // Stream the result back
        const stream = new ReadableStream({
            start(controller) {
                if (depth > 0) {
                    // If we did work, maybe add a preamble?
                    // For now just raw content.
                }
                controller.enqueue(new TextEncoder().encode(finalContent));
                controller.close();
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
