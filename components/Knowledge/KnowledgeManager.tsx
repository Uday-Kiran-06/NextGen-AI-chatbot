'use client';

import React, { useState } from 'react';
import { Globe, Loader2, BookOpen, Zap, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
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
        const toastId = toast.loading("Syncing core data...");
        try {
            let currentOffset = 0;
            let hasMore = true;
            let totalSynced = 0;

            while (hasMore) {
                const result = await syncInternalData(currentOffset, 20, currentOffset === 0);
                if (result.success) {
                    totalSynced += result.count || 0;
                    currentOffset = result.nextOffset || 0;
                    hasMore = result.hasMore || false;
                    
                    if (hasMore) {
                        toast.loading(`Syncing... ${currentOffset}/${result.total} rules`, { id: toastId });
                    } else {
                        toast.success(`Success! Synced ${totalSynced} internal rules.`, { id: toastId });
                        setIsOpen(false);
                    }
                } else {
                    toast.error(result.error || "Failed to sync core data", { id: toastId });
                    break;
                }
            }
        } catch (error) {
            toast.error("An unexpected error occurred during sync", { id: toastId });
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="px-4 pb-3">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[var(--sidebar-hover)] transition-colors group"
                style={{ backgroundColor: 'var(--sidebar-hover)' }}
            >
                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                    <span className="text-xs font-semibold" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                        Knowledge Base
                    </span>
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} style={{ color: 'var(--foreground)', opacity: 0.5 }} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3 space-y-2">
                            {/* URL Input */}
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--foreground)', opacity: 0.4 }} />
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Enter website URL..."
                                    className="w-full h-10 pl-10 pr-3 rounded-lg text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all"
                                    style={{ 
                                        backgroundColor: 'var(--sidebar-hover)',
                                        border: '1px solid var(--glass-border)',
                                        color: 'var(--foreground)'
                                    }}
                                />
                            </div>

                            {/* Sync Website Button */}
                            <button
                                onClick={handleCrawl}
                                disabled={isCrawling || !url}
                                className="w-full h-10 flex items-center justify-center gap-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-semibold"
                                style={{ backgroundColor: 'var(--accent-primary)', color: 'white' }}
                            >
                                {isCrawling ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        INDEXING SITE...
                                    </>
                                ) : (
                                    <>
                                        <Globe className="w-4 h-4" />
                                        SYNC WEBSITE
                                    </>
                                )}
                            </button>

                            {/* Sync Core Data Button */}
                            <button
                                onClick={handleSyncCore}
                                disabled={isSyncing}
                                className="w-full h-10 flex items-center justify-center gap-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-semibold"
                                style={{ 
                                    backgroundColor: 'var(--glass-bg)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--foreground)'
                                }}
                            >
                                {isSyncing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        SYNCING CORE...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                                        SYNC CORE DATA
                                    </>
                                )}
                            </button>

                            <p className="text-[10px] text-center leading-relaxed" style={{ color: 'var(--foreground)', opacity: 0.4 }}>
                                Scrapes up to 500 pages via recursive crawling. Core Data syncs fixed rules from project files.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
