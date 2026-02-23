import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("Missing GEMINI_API_KEY in environment variables");
}

export const genAI = new GoogleGenerativeAI(apiKey || '');

// Default fallback model
export const model = genAI.getGenerativeModel(
    { model: 'gemini-1.5-flash' },
    { apiVersion: 'v1' }
);

// Dynamic builder based on requested ID
export const getDynamicModel = (modelId: string) => {
    // Standardize model IDs if necessary
    let id = modelId || 'gemini-1.5-flash';
    if (id === 'gemini-1.5-flash') id = 'gemini-1.5-flash';
    if (id === 'gemini-1.5-pro') id = 'gemini-1.5-pro';

    return genAI.getGenerativeModel(
        {
            model: id,
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.7,
            }
        },
        { apiVersion: 'v1' }
    );
};

export const visionModel = genAI.getGenerativeModel(
    { model: 'gemini-1.5-flash' },
    { apiVersion: 'v1' }
);

export const embeddingModel = genAI.getGenerativeModel(
    { model: 'text-embedding-004' },
    { apiVersion: 'v1' }
);
