import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const apiKey = process.env.POLLINATIONS_API_KEY;
        if (!apiKey) {
            console.error('Missing POLLINATIONS_API_KEY in environment variables');
            return NextResponse.json({ error: 'Image generation is not configured' }, { status: 500 });
        }

        const encodedPrompt = encodeURIComponent(prompt.slice(0, 500));
        const seed = Math.floor(Math.random() * 1000000);
        const keyParam = `&key=${apiKey}`;

        // Construct the URL with nologo=true and the secure API key
        const imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true${keyParam}`;

        return NextResponse.json({ imageUrl });

    } catch (error) {
        console.error('Error in image API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
