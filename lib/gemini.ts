import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("Missing GEMINI_API_KEY in environment variables");
}

export const genAI = new GoogleGenerativeAI(apiKey || '');

// Default fallback model
export const model = genAI.getGenerativeModel(
    { model: 'gemini-2.5-flash' },
    { apiVersion: 'v1beta' }
);

// Dynamic builder based on requested ID
export const getDynamicModel = (modelId: string) => {
    // Standardize model IDs if necessary
    let id = modelId || 'gemini-1.5-flash';
    
    // If it's a Groq model or doesn't look like Gemini, fallback to flash for Gemini SDK
    if (!id.toLowerCase().includes('gemini') && !id.toLowerCase().includes('text-embedding') && !id.toLowerCase().includes('exp')) {
        id = 'gemini-1.5-flash';
    }

    // Mapping for user-friendly IDs
    if (id === 'gemini-1.5-flash-latest') id = 'gemini-1.5-flash';
    if (id === 'gemini-1.5-pro-latest') id = 'gemini-1.5-pro';
    if (id === 'gemini-2.5-flash') id = 'gemini-1.5-flash'; // Correcting mislabeled version
    if (id === 'gemini-2.5-pro') id = 'gemini-1.5-pro';   // Correcting mislabeled version
    
    return genAI.getGenerativeModel(
        {
            model: id,
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.7,
            }
        },
        { apiVersion: 'v1beta' } // Use v1beta for broader model support including previews
    );
};

export const visionModel = genAI.getGenerativeModel(
    { model: 'gemini-2.5-flash' },
    { apiVersion: 'v1beta' }
);

export const embeddingModel = genAI.getGenerativeModel(
    { model: 'embedding-001' },
    { apiVersion: 'v1beta' }
);
