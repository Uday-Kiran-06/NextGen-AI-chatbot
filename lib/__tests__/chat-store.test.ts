import { describe, it, expect, vi, beforeEach } from 'vitest';
import { chatStore } from '../chat-store';

// Hoist mocks to share between factory and tests
const mocks = vi.hoisted(() => {
    // Define the query builder object first so we can reference it
    const qb: any = {};

    // Define methods that return the qb itself for chaining
    qb.select = vi.fn().mockReturnValue(qb);
    qb.eq = vi.fn().mockReturnValue(qb);
    qb.is = vi.fn().mockReturnValue(qb);
    qb.order = vi.fn().mockReturnValue(qb);
    qb.insert = vi.fn().mockReturnValue(qb);
    qb.update = vi.fn().mockReturnValue(qb);
    qb.delete = vi.fn().mockReturnValue(qb);
    qb.single = vi.fn().mockReturnValue(qb);

    // Default thenable behavior (can be overridden in tests)
    qb.then = (resolve: any) => resolve({ data: [], error: null });

    return {
        getUser: vi.fn(),
        from: vi.fn().mockReturnValue(qb),
        queryBuilder: qb
    };
});

// Mock Supabase Client using the hoisted mocks
vi.mock('@/lib/supabase/client', () => ({
    createClient: vi.fn(() => ({
        auth: {
            getUser: mocks.getUser,
            onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
            signOut: vi.fn(),
        },
        from: mocks.from,
    })),
}));

describe('chatStore', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        // Restore default then implementation if tests override it
        mocks.queryBuilder.then = (resolve: any) => resolve({ data: [], error: null });
    });

    describe('Guest Mode', () => {
        it('should create a guest conversation if no user is logged in', async () => {
            // Mock no user
            mocks.getUser.mockResolvedValue({ data: { user: null } });

            const convo = await chatStore.createConversation('Test Chat');
            expect(convo).not.toBeNull();
            expect(convo?.id).toContain('guest-');
            expect(convo?.title).toBe('Test Chat');
        });

        it('should add messages to guest conversation', async () => {
            // Setup guest convo
            mocks.getUser.mockResolvedValue({ data: { user: null } });
            const convo = await chatStore.createConversation('Guest Chat');

            const msg = await chatStore.addMessage(convo!.id, 'user', 'Hello');
            expect(msg).not.toBeNull();
            expect(msg?.content).toBe('Hello');

            const messages = await chatStore.getMessages(convo!.id);
            expect(messages).toHaveLength(1);
            expect(messages[0].content).toBe('Hello');
        });
    });

    describe('Authenticated Mode', () => {
        const mockUser = { id: 'user-123' };

        it('should fetch conversations from Supabase', async () => {
            // Mock logged in user
            mocks.getUser.mockResolvedValue({ data: { user: mockUser } });

            // Mock DB response
            const mockData = [{ id: '1', title: 'Chat 1' }];

            // Override then to return data
            mocks.queryBuilder.then = (resolve: any) => resolve({ data: mockData, error: null });

            await chatStore.getConversations();

            expect(mocks.from).toHaveBeenCalledWith('conversations');
            expect(mocks.queryBuilder.select).toHaveBeenCalled();
            expect(mocks.queryBuilder.eq).toHaveBeenCalledWith('user_id', mockUser.id);
        });

        it('should create a conversation in Supabase', async () => {
            // Mock logged in user
            mocks.getUser.mockResolvedValue({ data: { user: mockUser } });

            const newConvo = { id: '2', title: 'New Chat', user_id: mockUser.id };

            // Override single() or then()
            // In createConversation, it calls .single() at the end. 
            // The chain is insert -> select -> single.
            // .single() should return a thenable probably?
            // In Supabase js, .single() returns a PostgrestSingleResponse, which is awaitable.
            // Our mock qb is the result of single() too because of .mockReturnValue(qb).
            // So awaiting it calls qb.then.

            mocks.queryBuilder.then = (resolve: any) => resolve({ data: newConvo, error: null });

            const result = await chatStore.createConversation('New Chat');

            expect(mocks.from).toHaveBeenCalledWith('conversations');
            expect(mocks.queryBuilder.insert).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ title: 'New Chat' })]));
            expect(result).toEqual(newConvo);
        });
    });
});
