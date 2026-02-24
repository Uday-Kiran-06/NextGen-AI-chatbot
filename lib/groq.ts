/**
 * Groq API Utility
 * 
 * Provides high-speed access to Llama 3, Mixtral, and other open-source models via Groq.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function callGroq(messages: any[], modelId: string = 'llama-3.3-70b-versatile') {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("Missing GROQ_API_KEY. Please add it to your environment variables.");
    }

    // Standardize model IDs for Groq
    let groqModel = modelId;
    if (modelId === 'llama3-70b') groqModel = 'llama-3.3-70b-versatile';
    if (modelId === 'mixtral-8x7b') groqModel = 'mixtral-8x7b-32768';
    if (modelId === 'llama-3-8b') groqModel = 'llama3-8b-8192';

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: groqModel,
            messages: messages,
            temperature: 0.7,
            max_tokens: 1024,
            stream: false, // We'll handle streaming differently if needed, but for now flat for simplicity
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Groq API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
}
