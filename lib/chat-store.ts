import { createClient, isSupabaseAvailable } from '@/lib/supabase/client';

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

const isGuest = (id: string) => id.startsWith('guest-') || id.startsWith('local-');

let guestConversations: Conversation[] = [];
const guestMessages: Record<string, Message[]> = {};

function getSupabase() {
    if (!isSupabaseAvailable()) {
        return null;
    }
    return createClient();
}

export const chatStore = {
    async getConversations() {
        if (!isSupabaseAvailable()) {
            return guestConversations
                .filter(c => !c.is_archived)
                .sort((a, b) => {
                    if (a.is_pinned && !b.is_pinned) return -1;
                    if (!a.is_pinned && b.is_pinned) return 1;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
        }

        const supabase = getSupabase();
        if (!supabase) {
            return guestConversations.filter(c => !c.is_archived);
        }

        let user = null;
        try {
            const { data } = await supabase.auth.getUser();
            user = data?.user;
        } catch (e) {
            console.warn('Auth check failed, defaulting to guest mode');
        }

        if (!user) {
            return guestConversations
                .filter(c => !c.is_archived)
                .sort((a, b) => {
                    if (a.is_pinned && !b.is_pinned) return -1;
                    if (!a.is_pinned && b.is_pinned) return 1;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
        }

        try {
            const { data, error } = await supabase
                .from('conversations')
                .select('id, user_id, title, created_at')
                .eq('user_id', user.id)
                .is('is_archived', false)
                .order('is_pinned', { ascending: false })
                .order('created_at', { ascending: false });

            if (error) throw error;
            return (data as Conversation[]) || [];
        } catch (error) {
            console.error('Error fetching conversations:', error);
            return guestConversations.filter(c => !c.is_archived);
        }
    },

    async createConversation(title: string) {
        if (!isSupabaseAvailable()) {
            const newConvo: Conversation = {
                id: `local-${Date.now()}`,
                user_id: 'local',
                title: title,
                created_at: new Date().toISOString(),
                is_pinned: false,
                is_archived: false
            };
            guestConversations.unshift(newConvo);
            return newConvo;
        }

        const supabase = getSupabase();
        if (!supabase) {
            const newConvo: Conversation = {
                id: `local-${Date.now()}`,
                user_id: 'local',
                title: title,
                created_at: new Date().toISOString(),
                is_pinned: false,
                is_archived: false
            };
            guestConversations.unshift(newConvo);
            return newConvo;
        }

        let user = null;
        try {
            const { data } = await supabase.auth.getUser();
            user = data?.user;
        } catch (e) {
            console.warn('Auth check failed, defaulting to guest');
        }

        if (!user) {
            const newConvo: Conversation = {
                id: `local-${Date.now()}`,
                user_id: 'local',
                title: title,
                created_at: new Date().toISOString(),
                is_pinned: false,
                is_archived: false
            };
            guestConversations.unshift(newConvo);
            return newConvo;
        }

        try {
            const { data, error } = await supabase
                .from('conversations')
                .insert([{ user_id: user.id, title }])
                .select('id, user_id, title, created_at')
                .single();

            if (error) throw error;
            return data as Conversation;
        } catch (error) {
            console.error('Error creating conversation:', error);
            const newConvo: Conversation = {
                id: `local-${Date.now()}`,
                user_id: user.id,
                title: title,
                created_at: new Date().toISOString(),
                is_pinned: false,
                is_archived: false
            };
            guestConversations.unshift(newConvo);
            return newConvo;
        }
    },

    async getMessages(conversationId: string) {
        if (isGuest(conversationId)) {
            return guestMessages[conversationId] || [];
        }

        if (!isSupabaseAvailable()) {
            return guestMessages[conversationId] || [];
        }

        const supabase = getSupabase();
        if (!supabase) {
            return guestMessages[conversationId] || [];
        }

        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return (data as Message[]) || [];
        } catch (error) {
            console.error('Error fetching messages:', error);
            return guestMessages[conversationId] || [];
        }
    },

    async addMessage(conversationId: string, role: 'user' | 'model', content: string) {
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

        if (!isSupabaseAvailable()) {
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

        const supabase = getSupabase();
        if (!supabase) {
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
    },

    async startNewChat(title: string, firstMessage: string) {
        const convo = await this.createConversation(title);
        if (convo) {
            await this.addMessage(convo.id, 'user', firstMessage);
        }
        return convo;
    },

    async deleteMessages(messageIds: string[]) {
        if (!messageIds || messageIds.length === 0) return true;
        
        for (const convoId in guestMessages) {
            guestMessages[convoId] = guestMessages[convoId].filter(m => !messageIds.includes(m.id));
        }

        if (!isSupabaseAvailable()) {
            return true;
        }

        const supabase = getSupabase();
        if (!supabase) {
            return true;
        }

        try {
            const { error } = await supabase.from('messages').delete().in('id', messageIds);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting messages:', error);
            return true;
        }
    },

    async updateMessage(messageId: string, newContent: string) {
        for (const convoId in guestMessages) {
            const msg = guestMessages[convoId].find(m => m.id === messageId);
            if (msg) msg.content = newContent;
        }

        if (!isSupabaseAvailable()) {
            return true;
        }

        const supabase = getSupabase();
        if (!supabase) {
            return true;
        }

        try {
            const { error } = await supabase.from('messages').update({ content: newContent }).eq('id', messageId);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error updating message:', error);
            return true;
        }
    },

    async deleteConversation(id: string) {
        guestConversations = guestConversations.filter(c => c.id !== id);
        delete guestMessages[id];

        if (!isSupabaseAvailable()) {
            return true;
        }

        const supabase = getSupabase();
        if (!supabase) {
            return true;
        }

        try {
            const { error } = await supabase.from('conversations').delete().eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting conversation:', error);
            return true;
        }
    },

    async renameConversation(id: string, newTitle: string) {
        const convo = guestConversations.find(c => c.id === id);
        if (convo) convo.title = newTitle;

        if (!isSupabaseAvailable() || isGuest(id)) {
            return true;
        }

        const supabase = getSupabase();
        if (!supabase) {
            return true;
        }

        try {
            const { error } = await supabase.from('conversations').update({ title: newTitle }).eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error renaming conversation:', error);
            return true;
        }
    },

    async togglePin(id: string, isPinned: boolean) {
        const convo = guestConversations.find(c => c.id === id);
        if (convo) convo.is_pinned = isPinned;

        if (!isSupabaseAvailable() || isGuest(id)) {
            return true;
        }

        const supabase = getSupabase();
        if (!supabase) {
            return true;
        }

        try {
            const { error } = await supabase.from('conversations').update({ is_pinned: isPinned }).eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error pinning conversation:', error);
            return true;
        }
    },

    async toggleArchive(id: string, isArchived: boolean) {
        const convo = guestConversations.find(c => c.id === id);
        if (convo) convo.is_archived = isArchived;

        if (!isSupabaseAvailable() || isGuest(id)) {
            return true;
        }

        const supabase = getSupabase();
        if (!supabase) {
            return true;
        }

        try {
            const { error } = await supabase.from('conversations').update({ is_archived: isArchived }).eq('id', id);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error archiving conversation:', error);
            return true;
        }
    },

    async searchConversations(query: string): Promise<string[]> {
        if (!query.trim()) return [];
        
        const localResults: string[] = [];
        for (const convoId in guestMessages) {
            const found = guestMessages[convoId].some(m => 
                m.content.toLowerCase().includes(query.toLowerCase())
            );
            if (found) localResults.push(convoId);
        }

        if (!isSupabaseAvailable()) {
            return localResults;
        }

        const supabase = getSupabase();
        if (!supabase) {
            return localResults;
        }

        try {
            const { data, error } = await supabase
                .from('messages')
                .select('conversation_id')
                .ilike('content', `%${query}%`);

            if (error) throw error;
            const dbResults = [...new Set(data.map(m => m.conversation_id))];
            return [...new Set([...localResults, ...dbResults])];
        } catch (error) {
            console.error('Error searching messages:', error);
            return localResults;
        }
    }
};
