'use client';

import React from 'react';
import { X, ExternalLink, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ArtifactViewerProps {
    isOpen: boolean;
    onClose: () => void;
    code: string;
    language: string;
}

export default function ArtifactViewer({ isOpen, onClose, code, language }: ArtifactViewerProps) {
    const [isMaximized, setIsMaximized] = React.useState(false);

    const getPreviewUrl = () => {
        if (language === 'html' || language === 'xml' || language === 'svg') {
            const blob = new Blob([code], { type: 'text/html' });
            return URL.createObjectURL(blob);
        }

        // Wrap snippets in a proper HTML doc with Tailwind support
        const fullHtml = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        body { background: white; min-height: 100vh; margin: 0; padding: 1.5rem; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; }
                    </style>
                </head>
                <body>
                    ${code}
                </body>
            </html>
        `;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        return URL.createObjectURL(blob);
    };

    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (isOpen && code) {
            const url = getPreviewUrl();
            setPreviewUrl(url);
            return () => {
                if (url) URL.revokeObjectURL(url);
            };
        }
    }, [isOpen, code, language]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className={cn(
                        "fixed z-[100] glass-panel flex flex-col overflow-hidden shadow-2xl border-white/10",
                        isMaximized
                            ? "top-0 bottom-0 left-0 right-0 rounded-none"
                            : "top-0 bottom-0 right-0 left-0 md:left-auto md:top-4 md:bottom-4 md:right-4 w-full md:w-[min(90vw,650px)] md:rounded-2xl"
                    )}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-lg shadow-red-500/20" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-lg shadow-amber-500/20" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-lg shadow-emerald-500/20" />
                            </div>
                            <span className="text-[10px] font-black text-foreground opacity-40 uppercase tracking-[0.2em] ml-2">
                                Artifact Preview
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="p-2 text-foreground/50 hover:text-foreground hover:bg-white/10 rounded-lg transition-all active:scale-95"
                                title={isMaximized ? "Minimize" : "Maximize"}
                            >
                                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 text-foreground/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all active:scale-95"
                                title="Close Preview"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Preview Content */}
                    <div className="flex-1 bg-white relative">
                        {previewUrl ? (
                            <iframe
                                src={previewUrl}
                                className="w-full h-full border-0"
                                title="Live Preview"
                                sandbox="allow-scripts"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-background">
                                <RotateCcw className="animate-spin mb-2" />
                                <span className="text-sm font-medium">Preparing Sandbox...</span>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 bg-black/40 backdrop-blur-md flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">
                                {language}
                            </span>
                            <span className="text-[10px] text-gray-600">
                                Sandboxed Environment
                            </span>
                        </div>
                        <a
                            href={previewUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-accent-primary hover:text-accent-secondary flex items-center gap-1.5 transition-colors font-medium"
                        >
                            Open in Browser <ExternalLink size={12} />
                        </a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
