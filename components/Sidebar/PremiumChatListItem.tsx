'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, Pin, MoreHorizontal, Edit3, 
    Share2, Trash2, Archive, Check, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Conversation } from '@/lib/chat-store';

interface PremiumChatListItemProps {
    item: Conversation;
    isActive: boolean;
    isEditing: boolean;
    editTitle: string;
    onSelect: () => void;
    onStartEdit: () => void;
    onEditChange: (title: string) => void;
    onEditSubmit: () => void;
    onEditCancel: () => void;
    onAction: (action: string) => void;
    index?: number;
}

export default function PremiumChatListItem({
    item, isActive, isEditing, editTitle, onSelect, onStartEdit,
    onEditChange, onEditSubmit, onEditCancel, onAction, index = 0
}: PremiumChatListItemProps) {
    const [showMenu, setShowMenu] = useState(false);

    const actionButtons = [
        { icon: Edit3, label: 'Rename', action: () => { setShowMenu(false); onStartEdit(); } },
        { icon: Pin, label: item.is_pinned ? 'Unpin' : 'Pin', action: () => onAction('pin') },
        { icon: Share2, label: 'Share', action: () => onAction('share') },
        { icon: Archive, label: 'Archive', action: () => onAction('archive') },
        { icon: Trash2, label: 'Delete', action: () => onAction('delete'), danger: true },
    ];

    if (isEditing) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group"
            >
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--sidebar-hover)', border: '1px solid var(--sidebar-border)' }}>
                    <Edit3 className="w-4 h-4 shrink-0" style={{ color: 'var(--foreground)', opacity: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => onEditChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onEditSubmit();
                            if (e.key === 'Escape') onEditCancel();
                        }}
                        onBlur={onEditSubmit}
                        autoFocus
                        className="flex-1 h-7 px-2 rounded text-sm outline-none border"
                        style={{ 
                            color: 'var(--foreground)',
                            backgroundColor: 'var(--sidebar-bg)',
                            borderColor: 'var(--sidebar-border)'
                        }}
                    />
                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            onClick={onEditSubmit}
                            className="p-1 rounded transition-colors"
                            style={{ color: 'var(--foreground)', opacity: 0.6 }}
                        >
                            <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={onEditCancel}
                            className="p-1 rounded transition-colors"
                            style={{ color: 'var(--foreground)', opacity: 0.6 }}
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02, duration: 0.15 }}
            className="group relative"
        >
            <div
                role="button"
                tabIndex={0}
                onClick={onSelect}
                onKeyDown={(e) => e.key === 'Enter' && onSelect()}
                className={cn(
                    "relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150",
                    isActive
                        ? "bg-[var(--accent-primary)] text-white"
                        : "hover:bg-[var(--sidebar-hover)]"
                )}
                style={{ color: isActive ? 'white' : 'var(--foreground)' }}
            >
                {/* Icon */}
                <div 
                    className={cn(
                        "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
                        isActive 
                            ? "bg-white/20" 
                            : "bg-[var(--sidebar-hover)] border border-[var(--sidebar-border)]"
                    )}
                    style={!isActive ? { color: 'var(--foreground)', opacity: 'var(--text-tertiary)' } : undefined}
                >
                    {item.is_pinned ? (
                        <Pin className="w-4 h-4" />
                    ) : (
                        <MessageSquare className="w-4 h-4" />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className={cn(
                        "text-sm truncate leading-tight",
                        isActive ? "font-medium" : "font-normal"
                    )}>
                        {item.title}
                    </p>
                    <p className="text-[11px] mt-0.5 truncate opacity-60">
                        {formatDate(item.created_at)}
                    </p>
                </div>

                {/* Menu Trigger */}
                <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShowMenu(!showMenu); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); setShowMenu(!showMenu); } }}
                    className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    style={{ color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--foreground)' }}
                >
                    <MoreHorizontal className="w-4 h-4" />
                </span>

                {/* Active Indicator */}
                {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[var(--accent-primary)] rounded-r" />
                )}
            </div>

            {/* Context Menu */}
            <AnimatePresence>
                {showMenu && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} onKeyDown={() => setShowMenu(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            transition={{ duration: 0.1 }}
                            className="absolute right-0 top-full mt-1 w-44 z-50 rounded-lg shadow-lg overflow-hidden"
                            style={{ 
                                backgroundColor: 'var(--sidebar-bg)', 
                                border: '1px solid var(--sidebar-border)'
                            }}
                        >
                            <div className="p-1">
                                {actionButtons.map((btn) => (
                                    <button
                                        key={btn.label}
                                        onClick={() => { setShowMenu(false); btn.action(); }}
                                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors"
                                        style={{ 
                                            color: btn.danger ? '#ef4444' : 'var(--foreground)',
                                            opacity: 0.85
                                        }}
                                    >
                                        <btn.icon className="w-4 h-4" />
                                        {btn.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
        return 'Yesterday';
    } else if (days < 7) {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}
