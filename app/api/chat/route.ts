
import { NextRequest, NextResponse } from 'next/server';
import { model } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const { history, message, layers } = await req.json();

        // history: Array of { role: 'user' | 'model', parts: string | array }
        // message: string (current message)
        // layers: Array of base64 images { mimeType, data }

        const chat = model.startChat({
            history: history.map((h: any) => ({
                role: h.role,
                parts: [{ text: h.content }]
            }))
        });

        let result;
        if (layers && layers.length > 0) {
            // Multimodal request (no chat history for vision in basic setup usually, but Flash supports it)
            // For simplicity, we'll just send the current prompt + images if images exist, 
            // or effectively use chat if no images.
            // Actually, startChat doesn't easily support images in history *yet* in all node sdk versions easily.
            // So if images, we use generateContent on the model directly with previous context if needed.

            const prompt = [message, ...layers.map((l: any) => ({
                inlineData: {
                    data: l.data,
                    mimeType: l.mimeType
                }
            }))];

            result = await model.generateContentStream(prompt);
        } else {
            result = await chat.sendMessageStream(message);
        }

        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    controller.enqueue(new TextEncoder().encode(chunkText));
                }
                controller.close();
            }
        });

        return new NextResponse(stream);

    } catch (error) {
        console.error('Error processing chat:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
