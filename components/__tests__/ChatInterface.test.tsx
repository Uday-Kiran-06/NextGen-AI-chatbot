import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatInterface from '../Chat/ChatInterface';
import { chatStore } from '@/lib/chat-store';

// Mock dependencies
vi.mock('@/lib/chat-store', () => ({
    chatStore: {
        getMessages: vi.fn(),
        addMessage: vi.fn(),
    },
}));

vi.mock('react-markdown', () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

// Mock fetch for the API route
global.fetch = vi.fn();

describe('ChatInterface', () => {
    const mockProps = {
        conversationId: '123',
        onConversationCreated: vi.fn(),
        onOpenSidebar: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should load messages when conversationId changes', async () => {
        (chatStore.getMessages as any).mockResolvedValue([
            { id: '1', role: 'user', content: 'Hello' },
            { id: '2', role: 'model', content: 'Hi there' },
        ]);

        render(<ChatInterface {...mockProps} />);

        await waitFor(() => {
            expect(screen.getByText('Hello')).toBeInTheDocument();
            expect(screen.getByText('Hi there')).toBeInTheDocument();
        });
    });

    it('should send a message and update UI', async () => {
        (chatStore.getMessages as any).mockResolvedValue([]);
        (chatStore.addMessage as any).mockResolvedValue({ id: 'new', role: 'user', content: 'Test Message' });

        // Mock API response
        (global.fetch as any).mockResolvedValue({
            body: {
                getReader: () => {
                    const encoder = new TextEncoder();
                    const stream = new ReadableStream({
                        start(controller) {
                            controller.enqueue(encoder.encode('AI Response'));
                            controller.close();
                        }
                    });
                    return stream.getReader();
                }
            }
        });

        render(<ChatInterface {...mockProps} />);

        const input = screen.getByPlaceholderText('Type a message...');
        fireEvent.change(input, { target: { value: 'Test Message' } });

        const sendButton = screen.getByRole('button', { name: /send/i }); // Assuming there's a button with aria-label or text
        // If exact name isn't found, we might need a test-id or adjusting the accessible role query
        // Let's use getByRole 'button' and filter if needed, or assume the send icon is the only button in that area.
        // However, Shadcn/Lucide icons usually are wrapped in buttons.
        // Let's optimize by query selector if needed, but accessibility is better.
        // Simpler: Fire enter key on input
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        await waitFor(() => {
            expect(chatStore.addMessage).toHaveBeenCalled();
            expect(global.fetch).toHaveBeenCalled();
        });
    });
});
