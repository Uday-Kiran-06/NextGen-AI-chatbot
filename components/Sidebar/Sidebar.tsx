'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, History, Settings, ChevronLeft, ChevronRight, Sparkles, Search, User, LogOut, MoreVertical, Share, Users, Edit2, Pin, Archive, Trash2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { chatStore, Conversation } from '@/lib/chat-store';
import { supabase } from '@/lib/supabase';

interface SidebarProps {
    activeId: string | null;
    onSelectChat: (id: string) => void;
    onNewChat: () => void;
    refreshKey: number;
}

// Helper component for menu options moved to bottom

export default function Sidebar({ activeId, onSelectChat, onNewChat, refreshKey, isOpen, onClose }: SidebarProps & { isOpen?: boolean, onClose?: () => void }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

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
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            fetchChats(); // Re-fetch chats on auth change
        });

        return () => subscription.unsubscribe();

    }, [refreshKey]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    const filteredHistory = conversations.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                className="font-bold text-xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 whitespace-nowrap"
                            >
                                NextGen
                            </motion.h1>
                        )}
                    </AnimatePresence>
                </div>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="md:hidden text-gray-400 hover:text-white"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Toggle Button - Desktop Only */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-accent-primary rounded-full items-center justify-center text-white text-xs z-50 hover:scale-110 transition-transform shadow-lg cursor-pointer"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
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
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent-primary/50 transition-all"
                        />
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Search">
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
                        "glass-button w-full flex items-center gap-3 py-3 font-semibold hover:bg-white/10 group relative overflow-hidden",
                        isCollapsed ? "justify-center px-0 rounded-xl" : "justify-start px-4 rounded-xl"
                    )}>
                    <MessageSquarePlus size={isCollapsed ? 24 : 20} className="group-hover:scale-110 transition-transform text-accent-secondary" />
                    {!isCollapsed && <span>New Chat</span>}
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-2 space-y-2 scrollbar-hide py-2">
                {!isCollapsed && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs font-bold text-gray-500 px-4 mb-2 uppercase tracking-widest"
                    >
                        History
                    </motion.p>
                )}

                {/* Filtered History Items */}
                {filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onSelectChat(item.id);
                                if (window.innerWidth < 768) onClose?.();
                            }}
                            className={cn(
                                "w-full text-left p-3 rounded-xl text-sm transition-all flex items-center gap-3 group relative overflow-hidden",
                                activeId === item.id ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5",
                                isCollapsed && "justify-center"
                            )}>
                            <History size={18} className="shrink-0 opacity-60 group-hover:opacity-100 group-hover:text-accent-primary transition-colors" />
                            {!isCollapsed && <span className="truncate relative z-10">{item.title}</span>}
                            {isCollapsed && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-xl" />}
                        </button>
                    ))
                ) : (
                    !isCollapsed && <div className="px-4 text-xs text-center text-gray-600 italic">
                        {loading ? 'Loading...' : 'No conversations'}
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
                            className="text-gray-500 hover:text-red-400 transition-colors p-1"
                            title="Sign Out"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                ) : (
                    <a href="/login" className={cn(
                        "w-full text-left p-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3",
                        isCollapsed && "justify-center"
                    )}>
                        <Settings size={20} />
                        {!isCollapsed && <span>Login / Profile</span>}
                    </a>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={{ width: 256 }}
                animate={{ width: isCollapsed ? 80 : 256 }}
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
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="md:hidden fixed top-0 left-0 bottom-0 w-[280px] glass-panel z-50 flex flex-col h-full bg-black/90 border-r border-white/10"
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
        className={cn("w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left", className)}
    >
        <Icon size={14} className="opacity-70" />
        {label}
    </button>
);
