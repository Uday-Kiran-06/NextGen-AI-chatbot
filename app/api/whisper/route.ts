import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as Blob;
        
        if (!file) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
        }

        const groqFormData = new FormData();
        groqFormData.append('file', file, 'audio.webm');
        groqFormData.append('model', 'whisper-large-v3');
        groqFormData.append('response_format', 'json');
        // Removed hardcoded 'en' to allow for automatic language detection (S-Tier multilingual support)
        // groqFormData.append('language', 'en');

        const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            body: groqFormData
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('[Whisper API Error]:', error);
            return NextResponse.json({ error: error.error?.message || 'Transcription failed' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ text: data.text });

    } catch (error: any) {
        console.error('[Whisper Route Error]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
