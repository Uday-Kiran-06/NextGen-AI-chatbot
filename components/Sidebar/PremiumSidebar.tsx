'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, X, PanelLeftClose, PanelLeft, 
    TrendingUp, Clock, Calendar, Archive,
    Loader2, ChevronDown, Plus, Bot,
    History, BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatStore, Conversation } from '@/lib/chat-store';
import { createClient, isSupabaseAvailable } from '@/lib/supabase/client';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import PremiumChatListItem from './PremiumChatListItem';
import PremiumSidebarFooter from './PremiumSidebarFooter';
import KnowledgeManager from '../Knowledge/KnowledgeManager';

interface SidebarProps {
    activeId: string | null;
    onSelectChat: (id: string) => void;
    onNewChat: () => void;
    refreshKey: number;
    isOpen?: boolean;
    onClose?: () => void;
}

const SPRING_CONFIG = { type: 'spring' as const, stiffness: 350, damping: 30 };

export default function PremiumSidebar({ 
    activeId, onSelectChat, onNewChat, refreshKey, isOpen, onClose 
}: SidebarProps) {
    const supabase = isSupabaseAvailable() ? createClient() : null;
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        'Today': true,
        'Yesterday': true,
        'Previous 7 Days': true,
        'Older': true
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const fetchChats = async () => {
            setLoading(true);
            const data = await chatStore.getConversations();
            setConversations(data);
            setLoading(false);
        };
        fetchChats();

        if (!supabase) return;
        const checkUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            } catch { setUser(null); }
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, session: Session | null) => {
                setUser(session?.user ?? null);
                fetchChats();
            }
        );
        return () => subscription.unsubscribe();
    }, [refreshKey, supabase]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (e.target && !((e.target as HTMLElement).closest?.('.chat-menu'))) setActiveMenuId(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const refreshChats = async () => {
        const data = await chatStore.getConversations();
        setConversations(data);
    };

    const [matchedIds, setMatchedIds] = useState<string[]>([]);
    useEffect(() => {
        if (!searchTerm.trim()) { setMatchedIds([]); return; }
        const timer = setTimeout(async () => {
            setIsSearching(true);
            const ids = await chatStore.searchConversations(searchTerm);
            setMatchedIds(ids);
            setIsSearching(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const filteredChats = conversations.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matchedIds.includes(item.id)
    );

    const groupedChats = (() => {
        const groups: Record<string, Conversation[]> = {
            'Today': [], 'Yesterday': [], 'Previous 7 Days': [], 'Older': []
        };
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today); lastWeek.setDate(lastWeek.getDate() - 7);
        
        filteredChats.forEach(c => {
            const date = new Date(c.created_at);
            if (date >= today) groups['Today'].push(c);
            else if (date >= yesterday) groups['Yesterday'].push(c);
            else if (date >= lastWeek) groups['Previous 7 Days'].push(c);
            else groups['Older'].push(c);
        });
        return groups;
    })();

    const handleAction = async (action: string, conversation: Conversation) => {
        setActiveMenuId(null);
        switch (action) {
            case 'rename': setEditingId(conversation.id); setEditTitle(conversation.title); break;
            case 'pin': await chatStore.togglePin(conversation.id, !conversation.is_pinned); refreshChats(); break;
            case 'archive': 
                if (confirm('Archive this chat?')) {
                    await chatStore.toggleArchive(conversation.id, true);
                    refreshChats();
                    if (activeId === conversation.id) onNewChat();
                }
                break;
            case 'delete':
                if (confirm('Delete permanently?')) {
                    await chatStore.deleteConversation(conversation.id);
                    refreshChats();
                    if (activeId === conversation.id) onNewChat();
                }
                break;
            case 'share':
                const msgs = await chatStore.getMessages(conversation.id);
                navigator.clipboard.writeText(msgs.map(m => `${m.role}: ${m.content}`).join('\n'));
                break;
        }
    };

    const handleRename = async (id: string) => {
        if (editTitle.trim() && editTitle !== conversations.find(c => c.id === id)?.title) {
            await chatStore.renameConversation(id, editTitle);
            refreshChats();
        }
        setEditingId(null);
    };

    const groupIcons: Record<string, React.ReactNode> = {
        'Today': <Clock className="w-3 h-3" />,
        'Yesterday': <Calendar className="w-3 h-3" />,
        'Previous 7 Days': <TrendingUp className="w-3 h-3" />,
        'Older': <Archive className="w-3 h-3" />
    };

    const sidebarContent = (
        <div 
            className="flex flex-col h-full w-full" 
            style={{ backgroundColor: 'var(--sidebar-bg)', color: 'var(--foreground)' }}
        >
            {/* Header */}
            <div className="shrink-0 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 hover:scale-105"
                            style={{ backgroundColor: 'var(--sidebar-hover)' }}
                        >
                            <motion.div
                                animate={{ rotate: isCollapsed ? 0 : 180 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isCollapsed ? (
                                    <PanelLeft className="w-4 h-4" style={{ color: 'var(--foreground)', opacity: 'var(--text-secondary)' }} />
                                ) : (
                                    <PanelLeftClose className="w-4 h-4" style={{ color: 'var(--foreground)', opacity: 'var(--text-secondary)' }} />
                                )}
                            </motion.div>
                        </button>
                        {!isCollapsed && (
                            <div className="flex items-center gap-2.5">
                                <div 
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
                                >
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div>
                                    <h1 className="font-semibold text-sm tracking-tight" style={{ color: 'var(--foreground)' }}>NextGen</h1>
                                    <p className="text-[10px]" style={{ color: 'var(--foreground)', opacity: 'var(--text-muted)' }}>AI Assistant</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => {
                                    onNewChat();
                                    if (window.innerWidth < 768) onClose?.();
                                }}
                                className="p-2 rounded-lg transition-colors"
                                style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onClose}
                                className="md:hidden p-2 rounded-lg transition-colors"
                                style={{ backgroundColor: 'var(--sidebar-hover)', color: 'var(--foreground)', opacity: 'var(--text-secondary)' }}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Search */}
                {!isCollapsed && (
                    <div className="px-4 pb-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--foreground)', opacity: 'var(--text-muted)' }} />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-10 pl-10 pr-10 rounded-lg text-sm placeholder:opacity-40 focus:outline-none transition-all"
                                style={{ 
                                    backgroundColor: 'var(--sidebar-hover)', 
                                    border: '1px solid var(--sidebar-border)',
                                    color: 'var(--foreground)'
                                }}
                            />
                            {isSearching && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin" style={{ color: 'var(--foreground)', opacity: 'var(--text-muted)' }} />
                            )}
                            {searchTerm && !isSearching && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full transition-colors"
                                    style={{ color: 'var(--foreground)', opacity: 'var(--text-secondary)' }}
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Knowledge Base */}
            {!isCollapsed && <KnowledgeManager />}

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-3 pb-4">
                {!isCollapsed ? (
                    <div className="space-y-1">
                        {loading ? (
                            <ChatSkeleton />
                        ) : filteredChats.length === 0 ? (
                            <EmptyState searchTerm={searchTerm} onNewChat={() => { onNewChat(); if (window.innerWidth < 768) onClose?.(); }} />
                        ) : (
                            Object.entries(groupedChats).map(([group, items]) =>
                                items.length > 0 && (
                                    <div key={group} className="mb-4">
                                        <button
                                            onClick={() => setExpandedGroups(p => ({ ...p, [group]: !p[group] }))}
                                            className="flex items-center gap-2 px-2 py-1.5 w-full text-left rounded-lg transition-colors"
                                            style={{ backgroundColor: 'var(--sidebar-hover)', color: 'var(--foreground)' }}
                                        >
                                            <span style={{ opacity: 'var(--text-tertiary)' }}>{groupIcons[group]}</span>
                                            <span className="text-[11px] font-medium uppercase tracking-wide" style={{ opacity: 'var(--text-tertiary)' }}>
                                                {group}
                                            </span>
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--glass-bg)', opacity: 0.9 }}>
                                                {items.length}
                                            </span>
                                            <ChevronDown className={cn(
                                                "w-3 h-3 ml-auto transition-transform"
                                            )} style={{ opacity: 'var(--text-tertiary)' }} />
                                        </button>
                                        <AnimatePresence>
                                            {expandedGroups[group] && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="space-y-0.5 pt-1">
                                                        {items.map((item, index) => (
                                                            <PremiumChatListItem
                                                                key={item.id}
                                                                item={item}
                                                                isActive={activeId === item.id}
                                                                isEditing={editingId === item.id}
                                                                editTitle={editTitle}
                                                                onSelect={() => { onSelectChat(item.id); if (window.innerWidth < 768) onClose?.(); }}
                                                                onStartEdit={() => { setEditingId(item.id); setEditTitle(item.title); }}
                                                                onEditChange={setEditTitle}
                                                                onEditSubmit={() => handleRename(item.id)}
                                                                onEditCancel={() => setEditingId(null)}
                                                                onAction={(action) => handleAction(action, item)}
                                                                index={index}
                                                            />
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            )
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 pt-2">
                        {/* Search Icon */}
                        <div className="relative">
                            <button
                                onClick={() => { setIsCollapsed(false); searchRef.current?.focus(); }}
                                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                                style={{ backgroundColor: 'var(--sidebar-hover)' }}
                            >
                                <Search className="w-4 h-4" style={{ color: 'var(--foreground)', opacity: 'var(--text-secondary)' }} />
                            </button>
                        </div>

                        {/* Knowledge Base Icon */}
                        <div className="relative">
                            <button
                                onClick={() => { setIsCollapsed(false); setShowKnowledgeBase(!showKnowledgeBase); }}
                                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                                style={{ 
                                    backgroundColor: showKnowledgeBase ? 'var(--accent-primary)' : 'var(--sidebar-hover)',
                                    color: showKnowledgeBase ? 'white' : 'var(--accent-primary)'
                                }}
                            >
                                <BookOpen className="w-4 h-4" />
                            </button>
                            <AnimatePresence>
                                {showKnowledgeBase && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute left-full top-0 ml-2 w-64 rounded-lg shadow-lg overflow-hidden z-50"
                                        style={{ backgroundColor: 'var(--sidebar-bg)', border: '1px solid var(--sidebar-border)' }}
                                    >
                                        <KnowledgeManager />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Divider */}
                        <div className="w-8 h-px mb-1" style={{ backgroundColor: 'var(--sidebar-border)' }} />

                        {filteredChats.slice(0, 8).map((item, i) => (
                            <div key={item.id} className="relative group">
                                <motion.button
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    onClick={() => { onSelectChat(item.id); if (window.innerWidth < 768) onClose?.(); }}
                                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                                    style={{ 
                                        backgroundColor: activeId === item.id ? 'var(--accent-primary)' : 'var(--sidebar-hover)',
                                        color: activeId === item.id ? 'white' : 'var(--foreground)'
                                    }}
                                >
                                    <History className="w-4 h-4" style={{ opacity: activeId === item.id ? 1 : 'var(--text-tertiary)' }} />
                                </motion.button>
                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded-md text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg"
                                    style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
                                >
                                    {item.title.substring(0, 20)}{item.title.length > 20 ? '...' : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <PremiumSidebarFooter 
                user={user} 
                isCollapsed={isCollapsed}
                onLogout={() => supabase?.auth.signOut().then(() => window.location.reload())}
                onExpand={() => setIsCollapsed(false)}
            />
        </div>
    );

    return (
        <>
            {/* Desktop */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 64 : 260 }}
                transition={SPRING_CONFIG}
                className="hidden md:flex flex-col h-full shrink-0 relative z-20"
            >
                <div 
                    className="absolute inset-0 shadow-xl" 
                    style={{ 
                        backgroundColor: 'var(--sidebar-bg)', 
                        borderRight: '1px solid var(--sidebar-border)'
                    }} 
                />
                <div className="relative flex flex-col h-full overflow-hidden">
                    {sidebarContent}
                </div>
            </motion.aside>

            {/* Mobile */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="md:hidden fixed inset-0 backdrop-blur-sm z-40"
                            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="md:hidden fixed inset-y-0 left-0 w-[280px] max-w-[85vw] z-50 flex flex-col"
                        >
                            <div 
                                className="absolute inset-0 shadow-2xl" 
                                style={{ backgroundColor: 'var(--sidebar-bg)' }} 
                            />
                            <div className="relative flex flex-col h-full overflow-hidden">
                                {sidebarContent}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function ChatSkeleton() {
    return (
        <div className="space-y-2 px-2">
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="h-10 rounded-lg animate-pulse"
                    style={{ backgroundColor: 'var(--sidebar-hover)' }}
                />
            ))}
        </div>
    );
}

function EmptyState({ searchTerm, onNewChat }: { searchTerm: string; onNewChat: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 px-4 text-center"
        >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--sidebar-hover)' }}>
                <History className="w-5 h-5" style={{ color: 'var(--foreground)', opacity: 'var(--text-tertiary)' }} />
            </div>
            <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                {searchTerm ? 'No results found' : 'No conversations yet'}
            </h3>
            <p className="text-xs max-w-[200px]" style={{ color: 'var(--foreground)', opacity: 'var(--text-muted)' }}>
                {searchTerm 
                    ? `No chats matching "${searchTerm}"`
                    : 'Start a new conversation to get help with tasks'
                }
            </p>
            {!searchTerm && (
                <button
                    onClick={onNewChat}
                    className="mt-4 px-4 py-2 text-xs font-medium rounded-lg transition-colors"
                    style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
                >
                    New Chat
                </button>
            )}
        </motion.div>
    );
}
