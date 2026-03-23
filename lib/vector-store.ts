
import { createAdminClient } from './supabase/admin';
import { embeddingModel } from './gemini';

export interface Document {
    id?: number;
    user_id?: string;
    content: string;
    metadata: Record<string, any>;
    similarity?: number;
}

/**
 * Generates an embedding using Hugging Face Inference API.
 * Uses sentence-transformers/all-mpnet-base-v2 (768 dimensions).
 */
async function embedTextHF(text: string, retries = 3, delay = 2000): Promise<number[]> {
    const hfKey = process.env.HUGGINGFACE_API_KEY;
    if (!hfKey || hfKey === 'hf_placeholder') {
        throw new Error("Missing HUGGINGFACE_API_KEY. Please add it to your environment variables.");
    }

    try {
        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-mpnet-base-v2",
            {
                headers: { 
                    "Authorization": `Bearer ${hfKey}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ 
                    inputs: [text], 
                    options: { wait_for_model: true } 
                }),
            }
        );

        if (response.status === 503 && retries > 0) {
            // Model is loading, wait and retry
            console.warn(`[VectorStore] HF Model loading. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return embedTextHF(text, retries - 1, delay * 1.5);
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Hugging Face API Error (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        
        // HF returns an array for single input, or array of arrays for batch
        if (Array.isArray(result) && typeof result[0] === 'number') {
            return result;
        } else if (Array.isArray(result) && Array.isArray(result[0])) {
            return result[0];
        }

        throw new Error("Unexpected response format from Hugging Face.");
    } catch (error: any) {
        console.error("HF Embedding Error:", error);
        throw error;
    }
}

/**
 * Generates an embedding for the given text.
 * Defaults to Hugging Face if KEY is present, otherwise falls back to Gemini.
 */
export async function embedText(text: string, retries = 3, delay = 1000): Promise<number[]> {
    const hfKey = process.env.HUGGINGFACE_API_KEY;
    
    // If HF Key is present and NOT the placeholder, use HF (better rate limits for sync)
    console.log(`[VectorStore] Initializing embedding. HF_KEY present: ${!!hfKey && hfKey !== 'hf_placeholder'}`);
    
    if (hfKey && hfKey !== 'hf_placeholder') {
        try {
            return await embedTextHF(text);
        } catch (error) {
            console.warn("[VectorStore] HF Embedding failed, falling back to Gemini:", error);
            // Fall through to Gemini
        }
    }

    try {
        const result = await embeddingModel.embedContent({
            content: { role: 'user', parts: [{ text }] },
            taskType: 'RETRIEVAL_DOCUMENT' as any,
            outputDimensionality: 768
        } as any);
        const embedding = result.embedding;
        return embedding.values;
    } catch (error: any) {
        // If rate limited and we have retries left
        if (error?.status === 429 && retries > 0) {
            console.warn(`[VectorStore] Rate limited. Retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return embedText(text, retries - 1, delay * 2);
        }
        
        console.error("Error generating embedding:", error);
        throw error;
    }
}

/**
 * Adds a document to the vector store.
 * Generates an embedding for the content and stores it in the 'documents' table.
 */
export async function addDocument(content: string, metadata: Record<string, any> = {}, userId?: string): Promise<Document | null> {
    try {
        const supabase = createAdminClient();
        const embedding = await embedText(content);

        const { data, error } = await supabase
            .from('documents')
            .insert({
                content,
                metadata,
                embedding,
                user_id: userId
            })
            .select()
            .single();

        if (error) {
            console.error("Error inserting document:", error);
            throw error;
        }

        return data;
    } catch (error: any) {
        console.error("Failed to add document:", error);
        throw error;
    }
}

/**
 * Searches for documents similar to the query string.
 * Uses the 'match_documents' RPC function in Supabase.
 */
export async function searchDocuments(
    query: string, 
    matchCount: number = 5, 
    threshold: number = 0.5,
    conversationId?: string, 
    userId?: string
): Promise<Document[]> {
    try {
        const supabase = createAdminClient();
        const queryEmbedding = await embedText(query);

        const { data: documents, error } = await supabase.rpc('match_documents', {
            query_embedding: queryEmbedding,
            match_threshold: threshold,
            match_count: matchCount,
            filter_conversation_id: conversationId || null,
            filter_user_id: userId || null
        });

        if (error) {
            console.error("Error searching documents:", error);
            throw new Error(`Supabase Search Error: ${error.message}`);
        }

        return documents || [];
    } catch (error: any) {
        console.error("Failed to search documents:", error);
        throw error; // Re-throw to be caught by the tool execution
    }
}
