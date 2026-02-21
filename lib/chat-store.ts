import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// Timeout guard: races a promise against a timer.
// Prevents the UI from freezing when Supabase is unreachable.
const AUTH_TIMEOUT_MS = 5000; // 5 seconds — balanced for slow-but-reachable servers

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`Supabase auth timed out after ${ms}ms`)), ms)
        ),
    ]);
}

// Centralized auth check with timeout guard
async function getAuthUser() {
    try {
        const { data } = await withTimeout(supabase.auth.getUser(), AUTH_TIMEOUT_MS);
        return data?.user ?? null;
    } catch (e) {
        console.warn('[Auth] Failed or timed out, defaulting to guest mode:', e);
        return null;
    }
}

export interface Conversation {
    id: string;
    user_id: string;
    title: string;
    created_at: string;
    is_pinned?: boolean;
    is_archived?: boolean;
}

export interface Message {
    id: string;
    chat_id: string;
    role: 'user' | 'model' | 'tool';
    content: string;
    created_at: string;
}

// Guest Mode Helper
const isGuest = (id: string) => id.startsWith('guest-');

// LocalStorage Helpers for Guest Session
const getGuestConversations = (): Conversation[] => {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem('guest_conversations');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

const setGuestConversations = (conversations: Conversation[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('guest_conversations', JSON.stringify(conversations));
    }
};

const getGuestMessages = (): Record<string, Message[]> => {
    if (typeof window === 'undefined') return {};
    try {
        const stored = localStorage.getItem('guest_messages');
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        return {};
    }
};

const setGuestMessages = (messages: Record<string, Message[]>) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('guest_messages', JSON.stringify(messages));
    }
};

export const chatStore = {
    // Fetch all conversations
    async getConversations() {
        const user = await getAuthUser();

        try {
            // Guest Mode: Return localStorage conversations
            if (!user) {
                return getGuestConversations()
                    .filter(c => !c.is_archived)
                    .sort((a, b) => {
                        // Sort by pinned (true first), then date (newest first)
                        if (a.is_pinned && !b.is_pinned) return -1;
                        if (!a.is_pinned && b.is_pinned) return 1;
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    });
            }

            const { data, error } = await supabase
                .from('chats')
                .select('id, user_id, title, created_at, is_pinned, is_archived') // Explicitly select columns to avoid "column does not exist" error
                .eq('user_id', user.id)
                .is('is_archived', false) // Enabled
                .order('is_pinned', { ascending: false }) // Enabled
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Conversation[];
        } catch (error) {
            console.error('Error fetching conversations:', JSON.stringify(error, null, 2));
            // Return empty array on error to prevent UI crashes
            return [];
        }
    },

    // Create a new conversation
    async createConversation(title: string) {
        const user = await getAuthUser();

        try {
            // Guest Mode: Create and store in localStorage
            if (!user) {
                const newConvo: Conversation = {
                    id: `guest-${Date.now()}`,
                    user_id: 'guest',
                    title: title,
                    created_at: new Date().toISOString(),
                    is_pinned: false,
                    is_archived: false
                };
                const guestConvos = getGuestConversations();
                guestConvos.unshift(newConvo); // Add to beginning
                setGuestConversations(guestConvos);
                return newConvo;
            }

            const { data, error } = await supabase
                .from('chats')
                .insert([{ user_id: user.id, title }])
                .select('id, user_id, title, created_at, is_pinned, is_archived')
                .single();

            if (error) throw error;
            return data as Conversation;
        } catch (error) {
            console.error('Error creating conversation:', error);
            return null;
        }
    },

    // Fetch messages for a specific conversation
    async getMessages(conversationId: string) {
        // Guest Mode: Retrieve from localStorage
        if (isGuest(conversationId)) {
            const guestMsgs = getGuestMessages();
            return guestMsgs[conversationId] || [];
        }

        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data as Message[];
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    },

    // Add a message to a conversation
    async addMessage(conversationId: string, role: 'user' | 'model', content: string) {
        // Guest Mode: Store in localStorage
        if (isGuest(conversationId)) {
            const newMsg: Message = {
                id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                chat_id: conversationId,
                role,
                content,
                created_at: new Date().toISOString()
            };

            const guestMsgs = getGuestMessages();
            if (!guestMsgs[conversationId]) {
                guestMsgs[conversationId] = [];
            }
            guestMsgs[conversationId].push(newMsg);
            setGuestMessages(guestMsgs);

            return newMsg;
        }

        // For Authenticated Users, message saving is now handled securely by the backend API 
        // route (app/api/chat/route.ts) to prevent optimistic UI desyncs. We return a stub here.
        return {
            id: `server-pending-${Date.now()}`,
            chat_id: conversationId,
            role,
            content,
            created_at: new Date().toISOString()
        } as Message;
    },

    // Create conversation AND add first message (helper)
    async startNewChat(title: string, firstMessage: string) {
        const convo = await this.createConversation(title);
        if (convo) {
            await this.addMessage(convo.id, 'user', firstMessage);
        }
        return convo;
    },

    // --- Enhanced Management Features ---

    async deleteConversation(id: string) {
        if (isGuest(id)) {
            const guestConvos = getGuestConversations().filter(c => c.id !== id);
            setGuestConversations(guestConvos);
            
            const guestMsgs = getGuestMessages();
            delete guestMsgs[id];
            setGuestMessages(guestMsgs);
            return true;
        }
        try {
            const { error } = await supabase.from('conversations').delete().eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting conversation:', error);
            return false;
        }
    },

    async renameConversation(id: string, newTitle: string) {
        if (isGuest(id)) {
            const guestConvos = getGuestConversations();
            const convo = guestConvos.find(c => c.id === id);
            if (convo) {
                convo.title = newTitle;
                setGuestConversations(guestConvos);
            }
            return true;
        }
        try {
            const { error } = await supabase.from('conversations').update({ title: newTitle }).eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error renaming conversation:', error);
            return false;
        }
    },

    async togglePin(id: string, isPinned: boolean) {
        if (isGuest(id)) {
            const guestConvos = getGuestConversations();
            const convo = guestConvos.find(c => c.id === id);
            if (convo) {
                convo.is_pinned = isPinned;
                setGuestConversations(guestConvos);
            }
            return true;
        }
        try {
            // Note: Requires 'is_pinned' column in Supabase 'conversations' table
            const { error } = await supabase.from('conversations').update({ is_pinned: isPinned }).eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error pinning conversation:', error);
            return false;
        }
    },

    async toggleArchive(id: string, isArchived: boolean) {
        if (isGuest(id)) {
            const guestConvos = getGuestConversations();
            const convo = guestConvos.find(c => c.id === id);
            if (convo) {
                convo.is_archived = isArchived;
                setGuestConversations(guestConvos);
            }
            return true;
        }
        try {
            // Note: Requires 'is_archived' column in Supabase
            const { error } = await supabase.from('conversations').update({ is_archived: isArchived }).eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error archiving conversation:', error);
            return false;
        }
    }
};
