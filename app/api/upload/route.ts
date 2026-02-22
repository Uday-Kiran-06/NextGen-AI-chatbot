import { NextRequest, NextResponse } from 'next/server';
import { addDocument } from '@/lib/vector-store';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fileData, fileName, mimeType, conversationId } = body;

        if (!fileData || !fileName) {
            return NextResponse.json({ error: 'Missing file data' }, { status: 400 });
        }

        // Security: Limit file size to 10MB (base64 is ~1.37x larger)
        const approxSizeInMB = (fileData.length * 0.75) / (1024 * 1024);
        if (approxSizeInMB > 10) {
            return NextResponse.json({ error: 'File size too large. Maximum limit is 10MB.' }, { status: 400 });
        }

        let textContent = '';

        if (mimeType === 'application/pdf') {
            // Decode base64 
            const buffer = Buffer.from(fileData, 'base64');
            const pdfParse = require('pdf-parse');
            const data = await pdfParse(buffer);
            textContent = data.text;
        } else if (mimeType.startsWith('text/')) {
            textContent = Buffer.from(fileData, 'base64').toString('utf-8');
        } else {
            return NextResponse.json({ error: 'Unsupported file type. Only PDF and Text files are supported for document understanding.' }, { status: 400 });
        }

        if (!textContent.trim()) {
            return NextResponse.json({ error: 'Could not extract text from document.' }, { status: 400 });
        }

        // Robust Recursive Chunking
        const recursiveSplit = (text: string, maxSize: number = 1000): string[] => {
            if (text.length <= maxSize) return [text];

            const separators = ['\n\n', '\n', '. ', ' ', ''];
            let bestSeparator = '';

            for (const sep of separators) {
                if (text.includes(sep)) {
                    bestSeparator = sep;
                    break;
                }
            }

            const parts = text.split(bestSeparator);
            const finalChunks = [];
            let current = '';

            for (const part of parts) {
                if ((current + bestSeparator + part).length > maxSize) {
                    if (current) finalChunks.push(current);
                    current = part;
                } else {
                    current = current ? current + bestSeparator + part : part;
                }
            }
            if (current) finalChunks.push(current);
            return finalChunks;
        };

        const chunks = recursiveSplit(textContent, 1500);

        let storedChunks = 0;
        const BATCH_SIZE = 5;

        // Process chunks in batches to improve speed while respecting rate limits
        for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
            const batch = chunks.slice(i, i + BATCH_SIZE);

            const promises = batch.map((chunk, index) => {
                const metadata = {
                    source: fileName,
                    chunk: i + index + 1,
                    totalChunks: chunks.length,
                    conversationId: conversationId || 'global'
                };
                return addDocument(chunk, metadata);
            });

            const results = await Promise.all(promises);
            storedChunks += results.filter(doc => doc !== null).length;

            // Optional: short delay between batches if rate limits are very strict
            // await new Promise(resolve => setTimeout(resolve, 100));
        }

        return NextResponse.json({
            success: true,
            message: `Document processed and learned. Extracted ${storedChunks} chunks.`,
            chunksStored: storedChunks
        });

    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
