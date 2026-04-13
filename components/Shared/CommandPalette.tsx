'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageSquare, Zap, Sparkles, Trash2, Moon, Sun, Command, X, ChevronRight, PenTool } from 'lucide-react';
import { AttractiveIcon } from './AttractiveIcon';
import { cn, vibrate } from '@/lib/utils';
import { chatStore, Conversation } from '@/lib/chat-store';
import { useTheme } from 'next-themes';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectChat: (id: string) => void;
    onNewChat: () => void;
    onModelChange: (modelId: string) => void;
    onSummarize?: () => void;
}

const MODELS = [
    { id: 'gemini-2.5-flash', label: 'Use Gemini 2.5 Flash', icon: Zap, category: 'Models' },
    { id: 'gemini-2.5-pro', label: 'Use Gemini 2.5 Pro', icon: Sparkles, category: 'Models' },
    { id: 'llama-3.3-70b-versatile', label: 'Use Llama 3.3', icon: Zap, category: 'Models' },
];

export default function CommandPalette({ isOpen, onClose, onSelectChat, onNewChat, onModelChange, onSummarize }: CommandPaletteProps) {
    const [query, setQuery] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { theme, setTheme } = useTheme();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            chatStore.getConversations().then(setConversations);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const items = [
        { id: 'new-chat', label: 'Start New Chat', icon: MessageSquare, category: 'Actions', action: onNewChat },
        { id: 'summarize', label: 'Summarize Current Chat', icon: PenTool, category: 'Actions', action: onSummarize },
        { id: 'toggle-theme', label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, icon: theme === 'dark' ? Sun : Moon, category: 'Actions', action: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
        { id: 'clear-all', label: 'Clear All History', icon: Trash2, category: 'Danger', action: () => { if(confirm('Clear all chats?')) { chatStore.clearAll(); onNewChat(); } } },
        ...MODELS.map(m => ({ ...m, action: () => onModelChange(m.id) })),
        ...conversations.map(c => ({ id: c.id, label: c.title, icon: MessageSquare, category: 'Recent Chats', action: () => onSelectChat(c.id) }))
    ].filter(item => item.label.toLowerCase().includes(query.toLowerCase()));

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % items.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + items.length) % items.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selected = items[selectedIndex];
            if (selected && selected.action) {
                selected.action();
                onClose();
                vibrate(5);
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-2xl bg-zinc-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl"
                        onKeyDown={handleKeyDown}
                    >
                        {/* Search Input */}
                        <div className="flex items-center px-4 py-4 border-b border-white/10">
                            <Search className="w-5 h-5 text-gray-400 mr-3" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Type a command or search chats..."
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setSelectedIndex(0);
                                }}
                                className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-gray-500"
                            />
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/10">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Esc</span>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
                            {items.length > 0 ? (
                                <div className="space-y-4 py-2">
                                    {Array.from(new Set(items.map(i => i.category))).map(category => (
                                        <div key={category}>
                                            <div className="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                                {category}
                                            </div>
                                            <div className="space-y-1 mt-1">
                                                {items.filter(i => i.category === category).map((item, index) => {
                                                    const globalIndex = items.indexOf(item);
                                                    const isSelected = selectedIndex === globalIndex;
                                                    return (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => {
                                                                if (item.action) item.action();
                                                                onClose();
                                                                vibrate(5);
                                                            }}
                                                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                            className={cn(
                                                                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group",
                                                                isSelected ? "bg-accent-primary text-white shadow-lg shadow-accent-primary/20" : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "p-2 rounded-lg transition-colors",
                                                                isSelected ? "bg-white/20" : "bg-white/5 group-hover:bg-white/10"
                                                            )}>
                                                                <item.icon size={18} />
                                                            </div>
                                                            <span className="flex-1 font-medium">{item.label}</span>
                                                            {isSelected && <ChevronRight size={16} className="opacity-50" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                                    <Search size={40} className="mb-4 opacity-20" />
                                    <p className="text-sm">No results found for "{query}"</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 bg-black/40 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400">↑↓</kbd>
                                    <span className="text-[10px] text-gray-500 uppercase font-medium">Navigate</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400">Enter</kbd>
                                    <span className="text-[10px] text-gray-500 uppercase font-medium">Select</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <AttractiveIcon icon={Command} size={14} className="text-gray-500" />
                                <span className="text-[11px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">NEXTGEN COMMAND</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
