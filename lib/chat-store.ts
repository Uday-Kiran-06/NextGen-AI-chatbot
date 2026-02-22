import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

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
    conversation_id: string;
    role: 'user' | 'model';
    content: string;
    created_at: string;
}

// Guest Mode Helper
const isGuest = (id: string) => id.startsWith('guest-');

// In-Memory Storage for Guest Session
let guestConversations: Conversation[] = [];
const guestMessages: Record<string, Message[]> = {};

export const chatStore = {
    // Fetch all conversations
    async getConversations() {
        let user = null;
        try {
            const { data } = await supabase.auth.getUser();
            user = data?.user;
        } catch (e) {
            console.warn('Auth check failed in getConversations, defaulting to guest mode:', e);
        }

        try {
            // Guest Mode: Return in-memory conversations
            if (!user) {
                return guestConversations
                    .filter(c => !c.is_archived)
                    .sort((a, b) => {
                        // Sort by pinned (true first), then date (newest first)
                        if (a.is_pinned && !b.is_pinned) return -1;
                        if (!a.is_pinned && b.is_pinned) return 1;
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    });
            }

            console.log('Fetching conversations safely...'); // Debug log
            const { data, error } = await supabase
                .from('conversations')
                .select('id, user_id, title, created_at') // Explicitly select columns to avoid "column does not exist" error
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
        let user = null;
        try {
            const { data } = await supabase.auth.getUser();
            user = data?.user;
        } catch (e) {
            console.warn('Auth check failed in createConversation, defaulting to guest:', e);
        }

        try {
            // Guest Mode: Create and store in memory
            if (!user) {
                const newConvo: Conversation = {
                    id: `guest-${Date.now()}`,
                    user_id: 'guest',
                    title: title,
                    created_at: new Date().toISOString(),
                    is_pinned: false,
                    is_archived: false
                };
                guestConversations.unshift(newConvo); // Add to beginning
                return newConvo;
            }

            const { data, error } = await supabase
                .from('conversations')
                .insert([{ user_id: user.id, title }])
                .select('id, user_id, title, created_at')
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
        // Guest Mode: Retrieve from memory
        if (isGuest(conversationId)) {
            return guestMessages[conversationId] || [];
        }

        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
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
        // Guest Mode: Store in memory
        if (isGuest(conversationId)) {
            const newMsg: Message = {
                id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                conversation_id: conversationId,
                role,
                content,
                created_at: new Date().toISOString()
            };

            if (!guestMessages[conversationId]) {
                guestMessages[conversationId] = [];
            }
            guestMessages[conversationId].push(newMsg);

            return newMsg;
        }

        try {
            const { data, error } = await supabase
                .from('messages')
                .insert([{ conversation_id: conversationId, role, content }])
                .select()
                .single();

            if (error) throw error;
            return data as Message;
        } catch (error) {
            console.error('Error adding message:', error);
            return null;
        }
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
            guestConversations = guestConversations.filter(c => c.id !== id);
            delete guestMessages[id];
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
            const convo = guestConversations.find(c => c.id === id);
            if (convo) convo.title = newTitle;
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
            const convo = guestConversations.find(c => c.id === id);
            if (convo) convo.is_pinned = isPinned;
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
            const convo = guestConversations.find(c => c.id === id);
            if (convo) convo.is_archived = isArchived;
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
