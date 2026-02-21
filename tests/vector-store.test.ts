
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { embedText, addDocument, searchDocuments } from '../lib/vector-store';

// Mock dependencies
vi.mock('../lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            insert: vi.fn(() => ({
                select: vi.fn(() => ({
                    single: vi.fn().mockResolvedValue({
                        data: { id: 1, content: 'test', metadata: {}, embedding: [] },
                        error: null,
                    }),
                })),
            })),
        })),
        rpc: vi.fn().mockResolvedValue({
            data: [
                { id: 1, content: 'test', metadata: {}, similarity: 0.9 },
            ],
            error: null,
        }),
    },
}));

vi.mock('../lib/gemini', () => ({
    embeddingModel: {
        embedContent: vi.fn().mockResolvedValue({
            embedding: { values: [0.1, 0.2, 0.3] },
        }),
    },
}));

describe('Vector Store', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should embed text successfully', async () => {
        const embedding = await embedText('hello world');
        expect(embedding).toEqual([0.1, 0.2, 0.3]);
    });

    it('should add a document', async () => {
        const doc = await addDocument('hello world', { source: 'test' });
        expect(doc).toBeDefined();
        expect(doc?.id).toBe(1);
    });

    it('should search documents', async () => {
        const results = await searchDocuments('hello');
        expect(results).toHaveLength(1);
        expect(results[0].content).toBe('test');
    });
});
