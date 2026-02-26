/**
 * Ollama API Utility
 * 
 * Connects to a local Ollama instance (localhost:11434) for private, zero-cost AI inference.
 */

export async function callOllama(messages: any[], modelId: string = 'llama3') {
    // Strip prefix
    const llmName = modelId.replace('ollama-', '');

    try {
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: llmName,
                messages: messages,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API Error: Make sure Ollama is running (` + response.statusText + `)`);
        }

        const data = await response.json();
        return data.message?.content || "";
    } catch (e: any) {
        throw new Error(`Failed to connect to local Ollama. Ensure the app is running: ` + e.message);
    }
}
