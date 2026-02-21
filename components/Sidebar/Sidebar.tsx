'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { chatStore, Conversation } from '@/lib/chat-store';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

// Sub-components
import { SidebarHeader } from './SidebarHeader';
import { UserProfile } from './UserProfile';
import { LogoutModal } from './LogoutModal';
import { ChatList } from './ChatHistoryList';

interface SidebarProps {
    activeId: string | null;
    onSelectChat: (id: string) => void;
    onNewChat: () => void;
    refreshKey: number;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ activeId, onSelectChat, onNewChat, refreshKey, isOpen, onClose }: SidebarProps) {
    const supabase = createClient();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Fetch Chats
    const fetchChats = async () => {
        setLoading(true);
        const data = await chatStore.getConversations();
        setConversations(data);
        setLoading(false);
    };

    useEffect(() => {
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

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    const SidebarContent = (
        <div className="flex flex-col h-full w-full">
            <SidebarHeader isCollapsed={isCollapsed} onClose={onClose} />

            {/* Toggle Button - Desktop Only */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-accent-primary rounded-full items-center justify-center text-white text-xs z-50 hover:scale-110 transition-transform shadow-lg cursor-pointer"
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                suppressHydrationWarning
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Search Bar */}
            <div className="px-4 mb-4">
                {!isCollapsed ? (
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent-primary/50 transition-all"
                            suppressHydrationWarning
                        />
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(false)}>
                                        <Search size={20} className="text-muted-foreground" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">Search</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
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
                    )}
                    suppressHydrationWarning
                >
                    <MessageSquarePlus size={isCollapsed ? 24 : 20} className="group-hover:scale-110 transition-transform text-accent-secondary" />
                    {!isCollapsed && <span>New Chat</span>}
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>

            <ChatList
                conversations={conversations}
                activeId={activeId}
                isCollapsed={isCollapsed}
                searchTerm={searchTerm}
                loading={loading}
                onSelectChat={onSelectChat}
                onNewChat={onNewChat}
                onCloseMobile={onClose}
                refreshChats={fetchChats}
            />

            <UserProfile user={user} isCollapsed={isCollapsed} onLogout={handleLogout} />

            <LogoutModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={confirmLogout}
            />
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={{ width: 280 }}
                animate={{ width: isCollapsed ? 80 : 280 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="hidden md:flex flex-col h-full shrink-0 relative z-20"
            >
                <div className="h-full w-full glass-panel rounded-r-2xl border-l-0 overflow-visible">
                    {SidebarContent}
                </div>
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
                            className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                        />
                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="md:hidden fixed top-0 left-0 bottom-0 w-[280px] z-50 flex flex-col h-full glass-panel border-l-0"
                        >
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
        suppressHydrationWarning
    >
        <Icon size={14} className="opacity-70" />
        {label}
    </button>
);
