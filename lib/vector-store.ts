
import { supabase } from './supabase';
import { embeddingModel } from './gemini';

export interface Document {
    id?: number;
    content: string;
    metadata: Record<string, any>;
    similarity?: number;
}

/**
 * Generates an embedding for the given text using Gemini's text-embedding-004 model.
 */
export async function embedText(text: string): Promise<number[]> {
    try {
        const result = await embeddingModel.embedContent(text);
        const embedding = result.embedding;
        return embedding.values;
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw error;
    }
}

/**
 * Adds a document to the vector store.
 * Generates an embedding for the content and stores it in the 'documents' table.
 */
export async function addDocument(content: string, metadata: Record<string, any> = {}): Promise<Document | null> {
    try {
        const embedding = await embedText(content);

        const { data, error } = await supabase
            .from('documents')
            .insert({
                content,
                metadata,
                embedding
            })
            .select()
            .single();

        if (error) {
            console.error("Error inserting document:", error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Failed to add document:", error);
        return null;
    }
}

/**
 * Searches for documents similar to the query string.
 * Uses the 'match_documents' RPC function in Supabase.
 */
export async function searchDocuments(query: string, matchCount: number = 5): Promise<Document[]> {
    try {
        const queryEmbedding = await embedText(query);

        const { data: documents, error } = await supabase.rpc('match_documents', {
            query_embedding: queryEmbedding,
            match_threshold: 0.5, // Adjust threshold as needed
            match_count: matchCount
        });

        if (error) {
            console.error("Error searching documents:", error);
            throw error;
        }

        return documents || [];
    } catch (error) {
        console.error("Failed to search documents:", error);
        return [];
    }
}
