import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("Missing GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey || '');

export const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
    }
});

export const visionModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
