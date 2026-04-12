'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Maximize2, Minimize2, RotateCcw, Code, Eye, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AttractiveIcon } from '../Shared/AttractiveIcon';
import { cn } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';

interface ArtifactViewerProps {
    isOpen: boolean;
    onClose: () => void;
    code: string;
    language: string;
}

export default function ArtifactViewer({ isOpen, onClose, code, language }: ArtifactViewerProps) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(650);
    const isResizing = useRef(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Tab Management: Default to code for data/json, preview for web tech
    useEffect(() => {
        if (['json', 'yaml', 'sql', 'bash'].includes(language.toLowerCase())) {
            setActiveTab('code');
        } else {
            setActiveTab('preview');
        }
    }, [language, isOpen]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success('Code copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    const startResizing = useCallback((e: React.MouseEvent) => {
        isResizing.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', stopResizing);
        document.body.style.cursor = 'col-resize';
    }, []);

    const stopResizing = useCallback(() => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', stopResizing);
        document.body.style.cursor = 'default';
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing.current) return;
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth > 320 && newWidth < window.innerWidth * 0.9) {
            setSidebarWidth(newWidth);
        }
    }, []);

    const getPreviewUrl = () => {
        const normalizedLang = language.toLowerCase();
        
        // Specialized Mermaid Rendering
        if (normalizedLang === 'mermaid') {
            const mermaidHtml = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <script type="module">
                            import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
                            mermaid.initialize({ startOnLoad: true, theme: 'dark' });
                        </script>
                        <style>
                            body { background: #0f172a; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 2rem; }
                            .mermaid { color: white; }
                        </style>
                    </head>
                    <body>
                        <pre class="mermaid">
                            ${code}
                        </pre>
                    </body>
                </html>
            `;
            const blob = new Blob([mermaidHtml], { type: 'text/html' });
            return URL.createObjectURL(blob);
        }

        if (normalizedLang === 'html' || normalizedLang === 'xml' || normalizedLang === 'svg') {
            const blob = new Blob([code], { type: 'text/html' });
            return URL.createObjectURL(blob);
        }

        if (['javascript', 'js', 'typescript', 'ts'].includes(normalizedLang)) {
            const jsCodeEncoded = encodeURIComponent(code);
            const fullHtml = `
                <!DOCTYPE html>
                <html>
                    <body style="background: #0f172a; color: #94a3b8; font-family: monospace; padding: 1.5rem; scrollbar-width: thin;">
                        <div id="output" style="white-space: pre-wrap;"></div>
                        <script>
                            const output = document.getElementById('output');
                            const log = (...args) => {
                                const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
                                output.innerHTML += '<div style="margin-bottom: 0.5rem; border-left: 2px solid #6366f1; padding-left: 0.75rem;">' + msg + '</div>';
                            };
                            console.log = log;
                            console.error = (...args) => {
                                const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
                                output.innerHTML += '<div style="margin-bottom: 0.5rem; border-left: 2px solid #ef4444; padding-left: 0.75rem; color: #ef4444;">' + msg + '</div>';
                            };
                            try {
                                const code = decodeURIComponent("${jsCodeEncoded}");
                                eval(code);
                            } catch (e) {
                                console.error(e);
                            }
                        </script>
                    </body>
                </html>
            `;
            const blob = new Blob([fullHtml], { type: 'text/html' });
            return URL.createObjectURL(blob);
        }

        if (normalizedLang === 'python' || normalizedLang === 'py') {
            const pyCodeEncoded = encodeURIComponent(code);
            const fullHtml = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <script src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js"></script>
                    </head>
                    <body style="background: #0f172a; color: #94a3b8; font-family: monospace; padding: 1.5rem;">
                        <div id="output" style="white-space: pre-wrap; color: #6366f1;">[ Sandbox ] Initializing Python (Pyodide)...\\n</div>
                        <script>
                            async function main() {
                                try {
                                    let pyodide = await loadPyodide();
                                    const outputDiv = document.getElementById('output');
                                    outputDiv.innerHTML = '<span style="color: #10b981;">[ Sandbox ] Environment Ready.\\n</span>'; 
                                    pyodide.setStdout({ batched: (msg) => outputDiv.innerHTML += msg + '\\n' });
                                    pyodide.setStderr({ batched: (msg) => outputDiv.innerHTML += '<span style="color: #ef4444;">' + msg + '</span>\\n' });
                                    await pyodide.runPythonAsync(decodeURIComponent("${pyCodeEncoded}"));
                                } catch (e) {
                                    document.getElementById('output').innerHTML += '<span style="color: #ef4444;">' + e + '</span>\\n';
                                }
                            }
                            main();
                        </script>
                    </body>
                </html>
            `;
            const blob = new Blob([fullHtml], { type: 'text/html' });
            return URL.createObjectURL(blob);
        }

        // Generic Tailwind Sandbox
        const fullHtml = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <script src="https://cdn.tailwindcss.com"></script>
                </head>
                <body class="bg-white min-h-screen p-6 font-sans">
                    ${code}
                </body>
            </html>
        `;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        return URL.createObjectURL(blob);
    };

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && code) {
            const url = getPreviewUrl();
            setPreviewUrl(url);
            return () => {
                if (url) URL.revokeObjectURL(url);
            };
        }
    }, [isOpen, code, language]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    style={{ width: isMaximized ? '100vw' : sidebarWidth }}
                    className={cn(
                        "fixed z-[9999] glass-panel flex flex-col overflow-hidden shadow-2xl border-white/10",
                        isMaximized
                            ? "top-0 bottom-0 left-0 right-0 rounded-none"
                            : "top-0 bottom-0 right-0 left-0 md:left-auto md:top-4 md:bottom-4 md:right-4 md:rounded-2xl"
                    )}
                >
                    {/* Resize Handle (Desktop Only) */}
                    {!isMaximized && (
                        <div
                            onMouseDown={startResizing}
                            className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-accent-primary/20 transition-colors z-50 group"
                        >
                            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-white/10 group-hover:bg-accent-primary/50 transition-colors" />
                        </div>
                    )}

                    {/* Enhanced Header */}
                    <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-lg shadow-red-500/20" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-lg shadow-amber-500/20" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-lg shadow-emerald-500/20" />
                            </div>
                            
                            {/* Tab Switcher */}
                            <div className="flex bg-white/5 p-1 rounded-lg border border-white/5 ml-2">
                                <button
                                    onClick={() => setActiveTab('preview')}
                                    className={cn(
                                        "px-3 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1.5",
                                        activeTab === 'preview' ? "bg-accent-primary text-white shadow-lg" : "text-foreground/40 hover:text-foreground/70"
                                    )}
                                >
                                    <AttractiveIcon icon={Eye} size={12} strokeWidth={3} />
                                    PREVIEW
                                </button>
                                <button
                                    onClick={() => setActiveTab('code')}
                                    className={cn(
                                        "px-3 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1.5",
                                        activeTab === 'code' ? "bg-accent-primary text-white shadow-lg" : "text-foreground/40 hover:text-foreground/70"
                                    )}
                                >
                                    <AttractiveIcon icon={Code} size={12} strokeWidth={3} />
                                    CODE
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="p-2 text-foreground/50 hover:text-foreground hover:bg-white/10 rounded-lg transition-all"
                                title={isMaximized ? "Minimize" : "Maximize"}
                            >
                                <AttractiveIcon icon={isMaximized ? Minimize2 : Maximize2} size={16} />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 text-foreground/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            >
                                <AttractiveIcon icon={X} size={20} gradient={['#ef4444', '#b91c1c']} glow />
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-background relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {activeTab === 'preview' ? (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full bg-white"
                                >
                                    {previewUrl ? (
                                        <iframe
                                            src={previewUrl}
                                            className="w-full h-full border-0"
                                            title="Live Preview"
                                            sandbox="allow-scripts"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-[#0f172a]">
                                            <AttractiveIcon icon={RotateCcw} size={32} className="animate-spin mb-3" gradient={['#6366f1', '#a855f7']} />
                                            <span className="text-sm font-medium tracking-wide">Initializing Sandbox...</span>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="code"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full overflow-auto bg-[#0f172a]"
                                >
                                    <SyntaxHighlighter
                                        language={language.toLowerCase()}
                                        style={atomDark}
                                        customStyle={{
                                            margin: 0,
                                            padding: '1.5rem',
                                            fontSize: '13px',
                                            lineHeight: '1.6',
                                            backgroundColor: 'transparent',
                                            minHeight: '100%'
                                        }}
                                        showLineNumbers
                                    >
                                        {code}
                                    </SyntaxHighlighter>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Professional Footer */}
                    <div className="px-4 py-3 bg-black/40 backdrop-blur-xl border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-gray-500 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase tracking-wider">
                                {language}
                            </span>
                            <div className="flex items-center gap-1.5 opacity-40">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Safe Sandbox</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleCopy}
                                className="text-[10px] font-bold text-foreground/50 hover:text-foreground flex items-center gap-1.5 transition-all bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 active:scale-95"
                            >
                                <AttractiveIcon icon={copied ? Check : Copy} size={12} gradient={copied ? ['#10b981', '#059669'] : ['#a855f7', '#6366f1']} />
                                {copied ? 'COPIED' : 'COPY CODE'}
                            </button>
                            <a
                                href={previewUrl || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-bold text-accent-primary hover:text-accent-secondary flex items-center gap-1.5 transition-all px-3 py-1.5"
                            >
                                OPEN BROWSER <AttractiveIcon icon={ExternalLink} size={12} gradient={['#6366f1', '#a855f7']} />
                            </a>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
