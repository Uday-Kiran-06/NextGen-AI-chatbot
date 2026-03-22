
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
 * Generates an embedding for the given text using Gemini's text-embedding-004 model.
 * Includes exponential backoff to handle rate limits (429).
 */
export async function embedText(text: string, retries = 3, delay = 1000): Promise<number[]> {
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
