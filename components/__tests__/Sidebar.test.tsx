import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Sidebar from '../Sidebar/Sidebar';
import { chatStore } from '@/lib/chat-store';

// Mock Supabase Client
vi.mock('@/lib/supabase/client', () => ({
    createClient: vi.fn(() => ({
        auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user: { email: 'test@example.com' } } }),
            onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
            signOut: vi.fn(),
        },
    })),
}));

// Mock Chat Store
vi.mock('@/lib/chat-store', () => ({
    chatStore: {
        getConversations: vi.fn(),
        togglePin: vi.fn(),
        toggleArchive: vi.fn(),
        deleteConversation: vi.fn(),
        renameConversation: vi.fn(),
    },
}));

// Mock Framer Motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        aside: ({ children, ...props }: any) => <aside {...props}>{children}</aside>,
        h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Sidebar', () => {
    const mockProps = {
        activeId: null,
        onSelectChat: vi.fn(),
        onNewChat: vi.fn(),
        refreshKey: 0,
        isOpen: true,
        onClose: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render conversations', async () => {
        (chatStore.getConversations as any).mockResolvedValue([
            { id: '1', title: 'Test Chat 1', created_at: new Date().toISOString() },
            { id: '2', title: 'Test Chat 2', created_at: new Date().toISOString() },
        ]);

        render(<Sidebar {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByText('Test Chat 1')).toBeInTheDocument();
            expect(screen.getByText('Test Chat 2')).toBeInTheDocument();
        });
    });

    it('should handle new chat click', async () => {
        (chatStore.getConversations as any).mockResolvedValue([]);
        render(<Sidebar {...mockProps} />);

        // Since "New Chat" button text is conditionally rendered or might be icon-only in some views,
        // let's target by text if visible, or closest role.
        // In our code: {!isCollapsed && <span>New Chat</span>}
        // Default state is expanded.

        const newChatBtn = screen.getByText('New Chat');
        fireEvent.click(newChatBtn);

        expect(mockProps.onNewChat).toHaveBeenCalled();
    });

    it('should filter chats by search term', async () => {
        (chatStore.getConversations as any).mockResolvedValue([
            { id: '1', title: 'Alpha', created_at: new Date().toISOString() },
            { id: '2', title: 'Beta', created_at: new Date().toISOString() },
        ]);

        render(<Sidebar {...mockProps} />);

        await waitFor(() => expect(screen.getByText('Alpha')).toBeInTheDocument());

        const searchInput = screen.getByPlaceholderText('Search chats...');
        fireEvent.change(searchInput, { target: { value: 'Alpha' } });

        expect(screen.getByText('Alpha')).toBeInTheDocument();
        expect(screen.queryByText('Beta')).not.toBeInTheDocument();
    });
});
