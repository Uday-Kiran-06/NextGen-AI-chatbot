import { NextRequest, NextResponse } from 'next/server';
import { getDynamicModel } from '@/lib/gemini';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { message, modelId, conversationId } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const model = getDynamicModel(modelId || 'gemini-1.5-flash');

        const prompt = `Generate a very short, concise 2 to 4 word title for a chat conversation that starts with the following message. Do not use quotes, punctuation, or preamble. Just the title text. \n\nMessage: "${message.slice(0, 500)}"`;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 20 }
        });

        let title = result.response.text().trim();
        // Clean up any quotes the model might have added despite instructions
        title = title.replace(/^["']|["']$/g, '');

        if (!title) {
            title = message.slice(0, 30) + '...';
        }

        return NextResponse.json({ title });

    } catch (error: any) {
        console.error('Error generating title:', error);
        return NextResponse.json({ error: 'Failed to generate title' }, { status: 500 });
    }
}
