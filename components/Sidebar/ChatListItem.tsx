import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Pin, MoreVertical, Edit2, Share, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Conversation } from '@/lib/chat-store';

interface ChatListItemProps {
    item: Conversation;
    activeId: string | null;
    isCollapsed: boolean;
    onSelectChat: (id: string) => void;
    onClose?: () => void;
    handleRenameSubmit: (e: React.FormEvent | React.FocusEvent, id: string) => void;
    editingId: string | null;
    editTitle: string;
    setEditTitle: (title: string) => void;
    setEditingId: (id: string | null) => void;
    activeMenuId: string | null;
    setActiveMenuId: (id: string | null) => void;
    handleAction: (e: React.MouseEvent, action: string, conversation: Conversation) => void;
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

export default function ChatListItem({
    item,
    activeId,
    isCollapsed,
    onSelectChat,
    onClose,
    handleRenameSubmit,
    editingId,
    editTitle,
    setEditTitle,
    setEditingId,
    activeMenuId,
    setActiveMenuId,
    handleAction
}: ChatListItemProps) {
    return (
        <div className="relative group/item">
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
    );
}
