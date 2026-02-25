'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, History, ChevronLeft, ChevronRight, Sparkles, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { chatStore, Conversation } from '@/lib/chat-store';
import { createClient } from '@/lib/supabase/client';
import ChatListItem from './ChatListItem';
import SidebarFooter from './SidebarFooter';

interface SidebarProps {
    activeId: string | null;
    onSelectChat: (id: string) => void;
    onNewChat: () => void;
    refreshKey: number;
}

export default function Sidebar({ activeId, onSelectChat, onNewChat, refreshKey, isOpen, onClose }: SidebarProps & { isOpen?: boolean, onClose?: () => void }) {
    const supabase = createClient();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Fetch Chats
        const fetchChats = async () => {
            setLoading(true);
            const data = await chatStore.getConversations();
            setConversations(data);
            setLoading(false);
        };
        fetchChats();

        // Check Auth
        const checkUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            } catch (error) {
                console.warn('Sidebar auth check failed:', error);
                setUser(null);
            }
        };
        checkUser();

        // Listen for Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null);
            fetchChats(); // Re-fetch chats on auth change
        });

        return () => subscription.unsubscribe();

    }, [refreshKey]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    // Click outside to close menu
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (!event.target.closest('.chat-menu-trigger') && !event.target.closest('.chat-menu-content')) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = async (e: React.MouseEvent, action: string, conversation: Conversation) => {
        e.stopPropagation(); // Prevent navigation
        setActiveMenuId(null);

        switch (action) {
            case 'rename':
                setEditingId(conversation.id);
                setEditTitle(conversation.title);
                break;
            case 'pin':
                await chatStore.togglePin(conversation.id, !conversation.is_pinned);
                refreshChats();
                break;
            case 'archive':
                if (confirm('Archive this chat?')) {
                    await chatStore.toggleArchive(conversation.id, true);
                    refreshChats();
                    if (activeId === conversation.id) onNewChat();
                }
                break;
            case 'delete':
                if (confirm('Delete this conversation permanently?')) {
                    await chatStore.deleteConversation(conversation.id);
                    refreshChats();
                    if (activeId === conversation.id) onNewChat();
                }
                break;
            case 'share':
                const messages = await chatStore.getMessages(conversation.id);
                const text = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
                navigator.clipboard.writeText(text);
                alert('Conversation copied to clipboard!');
                break;
        }
    };

    const handleRenameSubmit = async (e: React.FormEvent | React.FocusEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic Update
        if (editTitle.trim() && editTitle !== conversations.find(c => c.id === id)?.title) {
            setConversations(prev => prev.map(c =>
                c.id === id ? { ...c, title: editTitle } : c
            ));

            await chatStore.renameConversation(id, editTitle);
            refreshChats(); // Background refresh
        }
        setEditingId(null);
    };

    const refreshChats = async () => {
        // Helper to re-fetch without full loading state if desired, or just re-trigger effect
        // For now, we can just trigger the parent's refresh logic if we had one, 
        // but since we keep local state 'conversations', we should re-fetch:
        const data = await chatStore.getConversations();
        setConversations(data);
    };

    const filteredHistory = conversations.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupConversations = (items: Conversation[]) => {
        const groups: { [key: string]: Conversation[] } = {
            'Today': [],
            'Yesterday': [],
            'Previous 7 Days': [],
            'Older': []
        };

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        items.forEach(c => {
            const date = new Date(c.created_at);
            if (date >= today) groups['Today'].push(c);
            else if (date >= yesterday) groups['Yesterday'].push(c);
            else if (date >= lastWeek) groups['Previous 7 Days'].push(c);
            else groups['Older'].push(c);
        });

        return groups;
    };

    const conversationGroups = groupConversations(filteredHistory);

    const SidebarContent = (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div className={cn("flex items-center p-3 shrink-0", isCollapsed ? "flex-col justify-start gap-2 mt-2 mb-2" : "h-14 justify-between")}>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex p-2 text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-sidebar-hover rounded-lg transition-colors cursor-pointer group relative w-9 h-9 items-center justify-center"
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        suppressHydrationWarning
                    >
                        {isCollapsed ? (
                            <>
                                <Sparkles size={20} className="absolute text-foreground/70 transition-opacity duration-300 group-hover:opacity-0" />
                                <ChevronRight size={20} className="absolute opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </>
                        ) : (
                            <ChevronLeft size={20} />
                        )}
                    </button>
                    {!isCollapsed && (
                        <div className="flex items-center gap-2 px-1">
                            <Sparkles size={16} className="text-foreground/70" />
                            <span className="font-semibold text-[14px] text-foreground/90 tracking-wide">NextGen</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center">
                    <button
                        onClick={() => {
                            onNewChat();
                            setIsCollapsed(false);
                            if (window.innerWidth < 768) onClose?.();
                        }}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-sidebar-hover rounded-lg transition-colors group relative"
                        title="New Chat"
                        suppressHydrationWarning
                    >
                        <MessageSquarePlus size={20} />
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="md:hidden text-gray-500 dark:text-gray-400 hover:text-foreground p-2 rounded-lg hover:bg-sidebar-hover transition-colors ml-1"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className={cn("mb-4", isCollapsed ? "px-2" : "px-4")}>
                {!isCollapsed ? (
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-glass-bg border border-glass-border rounded-xl py-2 pl-9 pr-3 text-sm text-foreground placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent-primary/50 transition-all"
                            suppressHydrationWarning
                        />
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <button
                            onClick={() => setIsCollapsed(false)}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-sidebar-hover rounded-lg transition-colors cursor-pointer"
                            title="Search"
                        >
                            <Search size={20} />
                        </button>
                    </div>
                )}
            </div>


            <div className="flex-1 overflow-y-auto px-2 space-y-2 scrollbar-hide py-2">
                {/* Grouped History Items */}
                {!isCollapsed && (
                    filteredHistory.length > 0 ? (
                        Object.entries(conversationGroups).map(([groupName, groupItems]) => (
                            groupItems.length > 0 && (
                                <div key={groupName} className="mb-4">
                                    <h3 className="text-[10px] font-bold text-gray-500 px-4 mb-2 uppercase tracking-[0.2em]">
                                        {groupName}
                                    </h3>
                                    <div className="space-y-1">
                                        {groupItems.map((item) => (
                                            <ChatListItem
                                                key={item.id}
                                                item={item}
                                                activeId={activeId}
                                                isCollapsed={isCollapsed}
                                                onSelectChat={onSelectChat}
                                                onClose={onClose}
                                                handleRenameSubmit={handleRenameSubmit}
                                                editingId={editingId}
                                                editTitle={editTitle}
                                                setEditTitle={setEditTitle}
                                                setEditingId={setEditingId}
                                                activeMenuId={activeMenuId}
                                                setActiveMenuId={setActiveMenuId}
                                                handleAction={handleAction}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        ))
                    ) : loading ? (
                        // Skeleton Loaders
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className={cn(
                                "w-full p-3 rounded-xl flex items-center gap-3 animate-pulse bg-glass-bg/50 my-1 justify-start"
                            )}>
                                <div className="w-5 h-5 rounded-md bg-white/10 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-white/10 rounded w-full" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-12 flex flex-col items-center justify-center text-foreground/40">
                            <History size={32} className="mb-3 opacity-30 text-foreground" />
                            <span className="text-xs font-medium text-center text-foreground bg-foreground/5 px-3 py-1.5 rounded-full border border-foreground/10 shadow-lg">No conversations yet</span>
                        </div>
                    )
                )}
            </div>

            <SidebarFooter user={user} isCollapsed={isCollapsed} handleLogout={handleLogout} />
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={{ width: 260 }}
                animate={{ width: isCollapsed ? 60 : 260 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className={cn(
                    "hidden md:flex border-r border-glass-border flex-col z-20 overflow-hidden h-full shrink-0 relative group/sidebar transition-colors duration-300",
                    isCollapsed ? "bg-background" : "bg-sidebar-bg"
                )}
            >
                {SidebarContent}
            </motion.aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={{ left: 0.1, right: 0.8 }}
                            onDragEnd={(_, info) => {
                                if ((info.offset.x < -50 || info.velocity.x < -500) && onClose) {
                                    onClose();
                                }
                            }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="md:hidden fixed top-0 left-0 bottom-0 w-[280px] z-50 flex flex-col h-full bg-sidebar-bg border-r border-glass-border touch-none"
                        >
                            {/* Force expanded state on mobile */}
                            {SidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

