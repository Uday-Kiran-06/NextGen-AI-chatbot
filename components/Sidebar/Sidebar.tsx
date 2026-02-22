'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, History, Settings, ChevronLeft, ChevronRight, Sparkles, Search, User, LogOut, MoreVertical, Share, Users, Edit2, Pin, Archive, Trash2, Check, X, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { chatStore, Conversation } from '@/lib/chat-store';
import { createClient } from '@/lib/supabase/client';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

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
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

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
            <div className={cn("flex items-center gap-3 p-4 mb-2", isCollapsed ? "justify-center" : "justify-between")}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center shrink-0 shadow-lg shadow-accent-primary/20">
                        <Sparkles size={20} className="text-white" />
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.h1
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-bold text-xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-foreground to-gray-500 whitespace-nowrap"
                            >
                                NextGen
                            </motion.h1>
                        )}
                    </AnimatePresence>
                </div>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="md:hidden text-gray-500 dark:text-gray-400 hover:text-foreground hover:scale-110 active:scale-95 transition-all"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Toggle Button - Desktop Only */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-accent-primary rounded-full items-center justify-center text-white text-xs z-50 hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-accent-primary/50 cursor-pointer"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                suppressHydrationWarning
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Search Bar */}
            <div className="px-4 mb-4">
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
                        <button className="w-10 h-10 rounded-xl bg-glass-bg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-foreground hover:bg-glass-shimmer hover:scale-110 active:scale-95 transition-all" title="Search">
                            <Search size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* New Chat Button */}
            <div className="px-4 mb-6">
                <button
                    onClick={() => {
                        onNewChat();
                        if (window.innerWidth < 768) onClose?.();
                    }}
                    className={cn(
                        "w-full flex items-center gap-3 py-2.5 font-bold transition-all duration-500 active:scale-[0.96] group relative overflow-hidden",
                        isCollapsed
                            ? "justify-center px-0 rounded-xl bg-transparent text-gray-400 hover:text-white hover:bg-white/5 shadow-none"
                            : "justify-start px-3.5 rounded-[18px] bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-secondary hover:to-accent-primary text-white shadow-lg shadow-accent-primary/30 hover:shadow-xl hover:shadow-accent-primary/50"
                    )}
                    suppressHydrationWarning
                >
                    {!isCollapsed && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                    <div className={cn(
                        "flex items-center justify-center transition-all duration-300",
                        isCollapsed
                            ? "w-10 h-10 rounded-xl bg-transparent"
                            : "w-9 h-9 shrink-0 bg-white/20 rounded-xl backdrop-blur-md group-hover:scale-110 group-hover:rotate-6 border border-white/10 shadow-inner"
                    )}>
                        <MessageSquarePlus size={isCollapsed ? 22 : 18} strokeWidth={isCollapsed ? 2 : 2.5} className={cn(!isCollapsed && "text-white drop-shadow-lg")} />
                    </div>
                    {!isCollapsed && <span className="tracking-wide text-[15px] drop-shadow-md">New Chat</span>}

                    {/* Sparkle effect on hover */}
                    {!isCollapsed && <Sparkles size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500 text-white/90" />}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-2 space-y-2 scrollbar-hide py-2">
                {/* Grouped History Items */}
                {filteredHistory.length > 0 ? (
                    Object.entries(conversationGroups).map(([groupName, groupItems]) => (
                        groupItems.length > 0 && (
                            <div key={groupName} className="mb-4">
                                {!isCollapsed && (
                                    <h3 className="text-[10px] font-bold text-gray-500 px-4 mb-2 uppercase tracking-[0.2em]">
                                        {groupName}
                                    </h3>
                                )}
                                <div className="space-y-1">
                                    {groupItems.map((item) => (
                                        <div key={item.id} className="relative group/item">
                                            {editingId === item.id ? (
                                                <form
                                                    onSubmit={(e) => handleRenameSubmit(e, item.id)}
                                                    className="p-1 px-2"
                                                >
                                                    <input
                                                        type="text"
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        onBlur={(e) => handleRenameSubmit(e, item.id)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Escape') setEditingId(null);
                                                        }}
                                                        autoFocus
                                                        className="w-full bg-white/5 text-foreground rounded-lg px-2 py-1.5 text-sm outline-none border border-accent-primary/50"
                                                    />
                                                </form>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        onSelectChat(item.id);
                                                        if (window.innerWidth < 768) onClose?.();
                                                    }}
                                                    className={cn(
                                                        "w-full text-left p-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-3 relative overflow-hidden",
                                                        activeId === item.id
                                                            ? "bg-accent-primary/10 text-accent-primary font-medium"
                                                            : "text-foreground/70 hover:text-foreground hover:bg-glass-shimmer",
                                                        isCollapsed && "justify-center"
                                                    )}>

                                                    {/* Icon */}
                                                    {item.is_pinned ? (
                                                        <Pin size={14} className="shrink-0 text-accent-secondary fill-accent-secondary" />
                                                    ) : (
                                                        <History size={16} className={cn(
                                                            "shrink-0 transition-colors",
                                                            activeId === item.id ? "text-accent-primary" : "opacity-40 group-hover/item:opacity-100 group-hover/item:text-accent-primary"
                                                        )} />
                                                    )}

                                                    {/* Title */}
                                                    {!isCollapsed && (
                                                        <span className="truncate flex-1 tracking-tight">
                                                            {item.title}
                                                        </span>
                                                    )}

                                                    {/* Active Indicator */}
                                                    {activeId === item.id && !isCollapsed && (
                                                        <motion.div
                                                            layoutId="active-chat"
                                                            className="absolute left-0 w-1 h-6 bg-accent-primary rounded-r-full shadow-[0_0_10px_rgba(124,58,237,0.3)]"
                                                            initial={{ opacity: 0, x: -5 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -5 }}
                                                        />
                                                    )}
                                                </button>
                                            )}

                                            {/* Action Menu Trigger */}
                                            {!isCollapsed && !editingId && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveMenuId(activeMenuId === item.id ? null : item.id);
                                                    }}
                                                    className={cn(
                                                        "chat-menu-trigger absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-foreground hover:bg-glass-shimmer transition-all opacity-0 group-hover/item:opacity-100 z-20",
                                                        activeMenuId === item.id && "opacity-100 bg-glass-shimmer"
                                                    )}
                                                >
                                                    <MoreVertical size={14} />
                                                </button>
                                            )}

                                            {/* Dropdown Menu */}
                                            {!isCollapsed && activeMenuId === item.id && (
                                                <div className="chat-menu-content absolute right-0 top-full mt-1 w-44 bg-popover border border-glass-border rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                                    <div className="p-1">
                                                        <MenuOption icon={Edit2} label="Rename" onClick={(e: any) => handleAction(e, 'rename', item)} />
                                                        <MenuOption icon={Pin} label={item.is_pinned ? "Unpin" : "Pin"} onClick={(e: any) => handleAction(e, 'pin', item)} />
                                                        <MenuOption icon={Share} label="Export Chat" onClick={(e: any) => handleAction(e, 'share', item)} />
                                                        <div className="h-px bg-white/5 my-1 mx-2" />
                                                        <MenuOption icon={Trash2} label="Delete" onClick={(e: any) => handleAction(e, 'delete', item)} className="text-red-400 hover:bg-red-500/10" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ))
                ) : loading ? (
                    // Skeleton Loaders
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={cn(
                            "w-full p-3 rounded-xl flex items-center gap-3 animate-pulse bg-glass-bg/50 my-1",
                            isCollapsed ? "justify-center" : "justify-start"
                        )}>
                            <div className="w-5 h-5 rounded-md bg-white/10 shrink-0" />
                            {!isCollapsed && (
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-white/10 rounded w-full" />
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    !isCollapsed && <div className="px-4 py-12 flex flex-col items-center justify-center text-foreground/40">
                        <History size={32} className="mb-3 opacity-30 text-foreground" />
                        <span className="text-xs font-medium text-center text-foreground bg-foreground/5 px-3 py-1.5 rounded-full border border-foreground/10 shadow-lg">No conversations yet</span>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-white/5 mt-auto bg-black/20">
                {user ? (
                    <div className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-lg text-sm text-gray-400",
                        isCollapsed ? "justify-center flex-col gap-4" : "justify-between"
                    )}>
                        <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "justify-center")}>
                            <User size={20} className="text-accent-primary shrink-0" />
                            {!isCollapsed && (
                                <div className="flex flex-col truncate">
                                    <span className="text-white text-xs truncate">{user.email}</span>
                                    <span className="text-[10px] text-gray-500">Free Plan</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-gray-500 hover:text-red-400 hover:scale-110 active:scale-95 transition-all p-1"
                            title="Sign Out"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                ) : (
                    <a href="/login" className={cn(
                        "w-full text-left p-2 rounded-lg text-sm text-foreground opacity-70 hover:opacity-100 hover:bg-glass-shimmer transition-colors flex items-center gap-3",
                        isCollapsed && "justify-center"
                    )}>
                        <Settings size={20} />
                        {!isCollapsed && <span>Login / Profile</span>}
                    </a>
                )}



                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className={cn(
                        "w-full mt-2 text-left p-2 rounded-lg text-sm text-foreground opacity-70 hover:opacity-100 hover:bg-glass-shimmer transition-colors flex items-center gap-3",
                        isCollapsed && "justify-center"
                    )}
                >
                    {mounted && (theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />)}
                    {!mounted && <div className="w-5 h-5 rounded-full bg-white/10 animate-pulse" />}
                    {!isCollapsed && <span>{mounted ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : 'Theme'}</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={{ width: 256 }}
                animate={{ width: isCollapsed ? 76 : 256 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className="hidden md:flex glass-panel rounded-2xl flex-col z-20 overflow-hidden h-full shrink-0 relative group/sidebar"
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
                            className="md:hidden fixed top-0 left-0 bottom-0 w-[280px] glass-panel z-50 flex flex-col h-full bg-black/90 border-r border-white/10 touch-none"
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

const MenuOption = ({ icon: Icon, label, onClick, className }: any) => (
    <button
        onClick={onClick}
        className={cn("w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground opacity-70 hover:opacity-100 hover:bg-glass-shimmer rounded-lg transition-all active:scale-95 text-left", className)}
        suppressHydrationWarning
    >
        <Icon size={14} className="opacity-70" />
        {label}
    </button>
);
