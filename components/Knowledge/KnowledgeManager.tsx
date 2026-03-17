'use client';

import React, { useState } from 'react';
import { Globe, Loader2, CheckCircle2, AlertCircle, Plus, BookOpen, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { crawlWebsite } from '@/app/actions/crawl';
import { syncInternalData } from '@/app/actions/sync-internal';
import { toast } from 'sonner';

export default function KnowledgeManager() {
    const [url, setUrl] = useState('https://aliet.ac.in/');
    const [isCrawling, setIsCrawling] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [isSyncing, setIsSyncing] = useState(false);

    const handleCrawl = async () => {
        if (!url) {
            toast.error("Please enter a valid URL");
            return;
        }

        setIsCrawling(true);
        toast.info(`Starting crawl for ${url}...`);

        try {
            const result = await crawlWebsite(url);
            if (result.success) {
                toast.success(result.message);
                setUrl('');
                setIsOpen(false);
            } else {
                toast.error(result.error || "Failed to crawl");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsCrawling(false);
        }
    };

    const handleSyncCore = async () => {
        setIsSyncing(true);
        try {
            const result = await syncInternalData();
            if (result.success) {
                toast.success(`Success! Synced ${result.count} internal rules.`);
                setIsOpen(false);
            } else {
                toast.error(result.error || "Failed to sync core data");
            }
        } catch (error) {
            toast.error("An unexpected error occurred during sync");
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="px-3 mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
            >
                <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-accent-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/70 group-hover:text-foreground">
                        Knowledge Base
                    </span>
                </div>
                <Plus size={14} className={cn("text-foreground/40 transition-transform", isOpen ? "rotate-45" : "")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-2 pb-1 space-y-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Enter website URL..."
                                    className="w-full bg-black/20 border border-white/5 rounded-lg pl-8 pr-3 py-2 text-[11px] focus:outline-none focus:border-accent-primary/50 transition-colors"
                                />
                                <Globe size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
                            </div>
                            
                            <button
                                onClick={handleCrawl}
                                disabled={isCrawling || !url}
                                className="w-full bg-accent-primary/20 hover:bg-accent-primary/30 disabled:opacity-50 disabled:hover:bg-accent-primary/20 text-accent-primary text-[10px] font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                {isCrawling ? (
                                    <>
                                        <Loader2 size={12} className="animate-spin" />
                                        INDEXING SITE...
                                    </>
                                ) : (
                                    <>
                                        <Globe size={12} />
                                        SYNC WEBSITE
                                    </>
                                )}
                            </button>
                            
                            <button
                                onClick={handleSyncCore}
                                disabled={isSyncing}
                                className="w-full bg-white/5 hover:bg-white/10 border border-white/5 disabled:opacity-50 text-foreground/70 text-[10px] font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                {isSyncing ? (
                                    <>
                                        <Loader2 size={12} className="animate-spin" />
                                        SYNCING CORE...
                                    </>
                                ) : (
                                    <>
                                        <Zap size={12} className="text-yellow-500" />
                                        SYNC CORE DATA (RULES)
                                    </>
                                )}
                            </button>

                            <div className="pt-1 border-t border-white/5 mt-2">
                                <button
                                    onClick={() => {
                                        const newState = !(localStorage.getItem('nextgen_rules_enabled') !== 'false');
                                        localStorage.setItem('nextgen_rules_enabled', String(newState));
                                        window.dispatchEvent(new Event('storage')); // Trigger update if needed
                                        toast.success(`Rules Engine ${newState ? 'Enabled' : 'Disabled'}`);
                                        // Force a re-render for local state if we had it, but for simplicity we rely on next cycle or just localStorage
                                        setIsOpen(isOpen); // Dummy update to trigger re-render
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-[10px] font-bold",
                                        (typeof window !== 'undefined' && localStorage.getItem('nextgen_rules_enabled') !== 'false')
                                            ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/20"
                                            : "bg-white/5 text-foreground/40 border border-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <Zap size={12} />
                                        RULES ENGINE (INSTANT)
                                    </div>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        (typeof window !== 'undefined' && localStorage.getItem('nextgen_rules_enabled') !== 'false')
                                            ? "bg-accent-primary shadow-[0_0_8px_rgba(var(--accent-primary-rgb),0.5)]"
                                            : "bg-white/10"
                                    )} />
                                </button>
                            </div>
                            
                            <p className="text-[9px] text-white/30 text-center px-2">
                                Scrapes up to 500 pages using recursive domain crawling.
                                <br />
                                Core Data syncs fixed rules from project files.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper for class names since I don't want to import it if it's not standard in the file
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
