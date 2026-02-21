
import { NextRequest, NextResponse } from 'next/server';
import { runAgentWorkflow, executeToolCall } from '@/lib/agent/workflow-engine';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    try {
        const { history, message, layers, conversationId } = await req.json();

        // 1. Prepare agent variables

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
        } else if (response.type === 'tool_call') {
            // Context: The agent wants to use a tool but we hit the depth limit
            finalContent = "I apologize, but I reached a complexity limit while processing your request with tools. Could you please provide more specific details?";
        }

        // Fallback for empty content
        if (!finalContent.trim()) {
            finalContent = "I apologize, but I encountered an issue generating a response. Please try asking again.";
        }

        // --- BACKEND SECURE DB SYNC ---
        // Insert both user message and final AI message securely via serverless backend,
        // preventing optimistic UI desync issues on the frontend.
        if (conversationId && !conversationId.startsWith('guest-')) {
            const supabase = await createClient();
            
            // Note: Since message could contain image attachments in frontend, we should grab the original 'message' content
            // passed to generateAIResponse representing the full user node.
            await supabase.from('messages').insert([
                { chat_id: conversationId, role: 'user', content: message },
                { chat_id: conversationId, role: 'model', content: finalContent }
            ]);
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
        console.error('Error processing chat:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        return NextResponse.json(
            { error: 'Something went wrong. Please try again later.' },
            { status: 500 }
        );
    }
}
