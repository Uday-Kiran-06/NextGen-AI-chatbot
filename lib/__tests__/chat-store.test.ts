import { describe, it, expect, vi, beforeEach } from 'vitest';
import { chatStore } from '../chat-store';
import { createClient } from '../supabase/client';

// Mock Supabase Client
vi.mock('../supabase/client', () => ({
    createClient: vi.fn(() => ({
        auth: {
            getUser: vi.fn(),
            onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
            signOut: vi.fn(),
        },
        from: vi.fn(),
    })),
}));

describe('chatStore', () => {
    let supabaseMock: any;

    beforeEach(() => {
        supabaseMock = createClient();
        vi.clearAllMocks();
    });

    describe('Guest Mode', () => {
        it('should create a guest conversation if no user is logged in', async () => {
            // Mock no user
            supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });

            const convo = await chatStore.createConversation('Test Chat');
            expect(convo).not.toBeNull();
            expect(convo?.id).toContain('guest-');
            expect(convo?.title).toBe('Test Chat');
        });

        it('should add messages to guest conversation', async () => {
            // Setup guest convo
            supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });
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
            supabaseMock.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

            // Mock DB response
            const mockData = [{ id: '1', title: 'Chat 1' }];

            const queryBuilder: any = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                is: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                then: (resolve: any) => resolve({ data: mockData, error: null }),
            };

            // Fix: we need to ensure the chain calls return the builder *synchronously* 
            // but the final await triggers .then()

            supabaseMock.from.mockReturnValue(queryBuilder);

            await chatStore.getConversations();

            expect(supabaseMock.from).toHaveBeenCalledWith('conversations');
            expect(queryBuilder.select).toHaveBeenCalled();
            expect(queryBuilder.eq).toHaveBeenCalledWith('user_id', mockUser.id);
        });
    });
});
