'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Plus, X, Search, Terminal, MessageSquare, PenTool, Trash2 } from 'lucide-react';
import { AttractiveIcon } from '../Shared/AttractiveIcon';
import { cn, vibrate } from '@/lib/utils';

interface Snippet {
    id: string;
    title: string;
    content: string;
}

interface SnippetLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onInsert: (content: string) => void;
}

export default function SnippetLibrary({ isOpen, onClose, onInsert }: SnippetLibraryProps) {
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [search, setSearch] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('nextgen_snippets');
        if (saved) {
            setSnippets(JSON.parse(saved));
        } else {
            // Default snippets
            const defaults = [
                { id: '1', title: 'Explain Code', content: 'Can you explain how this code works in detail, focusing on modularity and performance?' },
                { id: '2', title: 'Refactor for Best Practices', content: 'Please refactor this code to follow modern best practices, improve readability, and add proper TypeScript types.' },
                { id: '3', title: 'Summarize Document', content: 'Provide a concise summary of this document, highlighting the top 5 key takeaways.' }
            ];
            setSnippets(defaults);
            localStorage.setItem('nextgen_snippets', JSON.stringify(defaults));
        }
    }, [isOpen]);

    const saveSnippets = (newSnippets: Snippet[]) => {
        setSnippets(newSnippets);
        localStorage.setItem('nextgen_snippets', JSON.stringify(newSnippets));
    };

    const handleAdd = () => {
        if (!newTitle || !newContent) return;
        const snippet: Snippet = {
            id: Date.now().toString(),
            title: newTitle,
            content: newContent
        };
        saveSnippets([snippet, ...snippets]);
        setIsAdding(false);
        setNewTitle('');
        setNewContent('');
        vibrate(5);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        saveSnippets(snippets.filter(s => s.id !== id));
        vibrate(2);
    };

    const filtered = snippets.filter(s => 
        s.title.toLowerCase().includes(search.toLowerCase()) || 
        s.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-950/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-accent-primary/20">
                                    <AttractiveIcon icon={Bookmark} size={20} gradient={['#7c3aed', '#db2777']} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Prompt Library</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Manage reusable snippets</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="p-4 bg-zinc-900 border-b border-white/5 flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                <input 
                                    type="text" 
                                    placeholder="Search snippets..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-accent-primary/50"
                                />
                            </div>
                            <button 
                                onClick={() => setIsAdding(true)}
                                className="p-2.5 bg-accent-primary text-white rounded-xl hover:bg-accent-primary/90 transition-all active:scale-95 shadow-lg shadow-accent-primary/20"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                            <AnimatePresence mode="popLayout">
                                {isAdding && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="p-4 rounded-2xl bg-accent-primary/5 border border-accent-primary/30 space-y-3 mb-6"
                                    >
                                        <input 
                                            type="text" 
                                            placeholder="Snippet Title..." 
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none"
                                        />
                                        <textarea 
                                            placeholder="Enter prompt content..." 
                                            value={newContent}
                                            onChange={(e) => setNewContent(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white h-24 resize-none focus:outline-none"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-white">Cancel</button>
                                            <button onClick={handleAdd} className="px-4 py-2 bg-accent-primary text-white text-xs font-bold rounded-lg">Save Snippet</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {filtered.length > 0 ? (
                                filtered.map((s) => (
                                    <motion.div
                                        key={s.id}
                                        layout
                                        onClick={() => {
                                            onInsert(s.content);
                                            onClose();
                                        }}
                                        className="w-full group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-primary/30 hover:bg-white/10 transition-all text-left flex gap-4 items-start cursor-pointer"
                                    >
                                        <div className="p-2 rounded-lg bg-zinc-800 group-hover:bg-accent-primary/10 transition-colors">
                                            <PenTool size={16} className="text-gray-400 group-hover:text-accent-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm text-white mb-1">{s.title}</h4>
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{s.content}</p>
                                        </div>
                                        <button 
                                            onClick={(e) => handleDelete(s.id, e)}
                                            className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-lg text-red-500 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-gray-600">
                                    <Bookmark size={48} className="mb-4 opacity-10" />
                                    <p className="text-sm font-medium">No snippets found</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-zinc-950/50 border-t border-white/5 flex items-center justify-center">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Terminal size={10} /> Click a snippet to insert into chat
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
