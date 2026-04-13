'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, Image as ImageIcon, X } from 'lucide-react';
import { AttractiveIcon } from './AttractiveIcon';
import { cn } from '@/lib/utils';

interface GlobalDropzoneProps {
    onFilesDropped: (files: File[]) => void;
    children: React.ReactNode;
}

export default function GlobalDropzone({ onFilesDropped, children }: GlobalDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragCounter, setDragCounter] = useState(0);

    const handleDragEnter = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(prev => prev + 1);
        if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, []);

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(prev => prev - 1);
        if (dragCounter <= 1) {
            setIsDragging(false);
        }
    }, [dragCounter]);

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        setDragCounter(0);

        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            onFilesDropped(files);
        }
    }, [onFilesDropped]);

    useEffect(() => {
        window.addEventListener('dragenter', handleDragEnter);
        window.addEventListener('dragleave', handleDragLeave);
        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('drop', handleDrop);

        return () => {
            window.removeEventListener('dragenter', handleDragEnter);
            window.removeEventListener('dragleave', handleDragLeave);
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('drop', handleDrop);
        };
    }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

    return (
        <div className="relative h-full w-full">
            {children}

            <AnimatePresence>
                {isDragging && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-accent-primary/10 backdrop-blur-md" />
                        
                        {/* Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative z-10 p-12 rounded-[40px] glass-panel border-2 border-dashed border-accent-primary/50 bg-white/5 dark:bg-black/40 shadow-2xl flex flex-col items-center gap-6"
                        >
                            <div className="relative">
                                <motion.div
                                    animate={{ 
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="p-6 rounded-3xl bg-accent-primary/20"
                                >
                                    <AttractiveIcon icon={Upload} size={48} gradient={['#7c3aed', '#db2777']} glow />
                                </motion.div>
                                <motion.div
                                    animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute -top-4 -right-4 p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10"
                                >
                                    <AttractiveIcon icon={ImageIcon} size={20} />
                                </motion.div>
                                <motion.div
                                    animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                    className="absolute -bottom-4 -left-4 p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10"
                                >
                                    <AttractiveIcon icon={File} size={20} />
                                </motion.div>
                            </div>

                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-foreground mb-2">Drop to Upload</h2>
                                <p className="text-gray-500 max-w-[240px]">Release your files here to instantly attach them to the conversation.</p>
                            </div>

                            <div className="flex gap-2">
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-400">PDF</span>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-400">JPG/PNG</span>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-gray-400">TXT</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
