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
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
            <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-50">
                <Button
                    variant="default"
                    size="icon"
                    className="h-6 w-6 rounded-full shadow-lg border border-white/10"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
                </Button>
            </div>

            {/* Search Bar */}
            <div className="px-4 mb-4">
                {!isCollapsed ? (
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-white/5 border-white/10 focus:bg-black/50 transition-colors"
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
                <TooltipProvider>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => {
                                    onNewChat();
                                    if (window.innerWidth < 768) onClose?.();
                                }}
                                className={cn(
                                    "w-full gap-3 shadow-[0_0_20px_-5px_var(--accent)] hover:shadow-[0_0_25px_-5px_var(--accent)] transition-all",
                                    isCollapsed && "px-0 justify-center"
                                )}
                                size="lg"
                            >
                                <MessageSquarePlus size={isCollapsed ? 20 : 18} />
                                {!isCollapsed && <span>New Chat</span>}
                            </Button>
                        </TooltipTrigger>
                        {isCollapsed && <TooltipContent side="right">New Chat</TooltipContent>}
                    </Tooltip>
                </TooltipProvider>
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
