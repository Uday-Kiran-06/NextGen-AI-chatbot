'use client';

import { useState, useRef, useEffect } from 'react';
import MessageBubble, { MessageSkeleton } from './MessageBubble';
import InputArea from './InputArea';
import WelcomeView from './WelcomeView';
import { Menu, RefreshCw, Copy, FileDown, Bot, Atom } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useShortcuts } from '@/hooks/use-shortcuts';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { useChat } from '@/hooks/useChat';

const ArtifactViewer = dynamic(() => import('./ArtifactViewer'), {
    ssr: false,
    loading: () => <div className="hidden">Loading Viewer...</div>
});

const MODELS = [
    { id: 'gemini-2.5-flash', label: 'Gemini 2.5' },
    { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
    { id: 'gemini-3-flash-preview', label: 'Gemini 3 Preview' },
    { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B' },
    { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7b' },
    { id: 'ollama-llama3', label: 'Local (Ollama)' },
];

interface ChatInterfaceProps {
    conversationId: string | null;
    onConversationCreated: (id: string) => void;
    onOpenSidebar?: () => void;
    onNewChat?: () => void;
}

export default function ChatInterface({ conversationId, onConversationCreated, onOpenSidebar, onNewChat }: ChatInterfaceProps) {
    const [modelId, setModelId] = useState('llama-3.3-70b-versatile');
    const activeModel = MODELS.find(m => m.id === modelId) || MODELS[0];
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { theme, setTheme } = useTheme();

    const {
        messages,
        isGenerating,
        agentAction,
        handleSendMessage,
        handleEditMessage,
        handleRegenerate,
        handleStopGeneration
    } = useChat({
        conversationId,
        onConversationCreated,
        modelId
    });

    // Round 3: Scroll & Gesture States
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [pullDistance, setPullDistance] = useState(0);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Artifact Viewer State
    const [artifactCode, setArtifactCode] = useState<string>('');
    const [artifactLang, setArtifactLang] = useState<string>('');
    const [isArtifactOpen, setIsArtifactOpen] = useState(false);

    const handleOpenArtifact = (code: string, lang: string) => {
        setArtifactCode(code);
        setArtifactLang(lang);
        setIsArtifactOpen(true);
    };

    // Keyboard Shortcuts
    useShortcuts({
        onNewChat: () => onNewChat?.(),
        onToggleSidebar: () => onOpenSidebar?.(),
        onFocusInput: () => {
            const textarea = document.querySelector('textarea');
            textarea?.focus();
        },
        onToggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
        onStopGeneration: handleStopGeneration
    });

    // Load initial model from localStorage
    useEffect(() => {
        const savedModel = localStorage.getItem('nextgen_model');
        if (savedModel) {
            setModelId(savedModel);
        }
    }, []);

    const handleModelChange = (newModelId: string) => {
        setModelId(newModelId);
        localStorage.setItem('nextgen_model', newModelId);
        setIsModelDropdownOpen(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);



    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const currentScrollY = target.scrollTop;

        // Auto-hide header on scroll down, show on scroll up
        if (currentScrollY > 100) {
            if (currentScrollY > lastScrollY && showHeader) {
                setShowHeader(false);
            } else if (currentScrollY < lastScrollY && !showHeader) {
                setShowHeader(true);
            }
        } else {
            setShowHeader(true);
        }
        setLastScrollY(currentScrollY);
    };

    return (
        <div className="flex-1 flex flex-col h-full relative z-0 overflow-hidden">

            {/* Mobile Header - Sticky, Capsule, Floating */}
            <motion.div
                initial={false}
                animate={{
                    y: showHeader ? 0 : -100,
                    opacity: showHeader ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden absolute top-[calc(env(safe-area-inset-top,0px)+8px)] left-3 right-3 z-50 flex items-center justify-between px-4 py-2.5 bg-sidebar-bg/80 backdrop-blur-xl border border-glass-border rounded-2xl shadow-lg ring-1 ring-white/10"
            >
                <button
                    onClick={onOpenSidebar}
                    className="p-2 -ml-2 text-foreground opacity-70 hover:opacity-100 hover:scale-110 active:scale-95 transition-all rounded-xl hover:bg-white/5 relative z-10"
                    aria-label="Open Sidebar"
                >
                    <Menu size={20} />
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="font-bold text-[13px] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">
                        NextGen AI
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-500 flex items-center gap-1">
                        <Bot size={8} className="text-violet-500 animate-pulse" />
                        {activeModel?.label || 'Gemini'}
                    </div>
                </div>
            </motion.div>

            {/* ChatMessages Area - Extends to full height underneath input */}
            <div
                ref={chatContainerRef}
                className={`absolute inset-0 overflow-y-auto touch-pan-y ${messages.length === 0 ? '' : 'pt-20 md:pt-4 pb-[180px] md:pb-[140px]'}`}
                onScroll={handleScroll}
            >
                {/* Pull to New Chat Indicator */}
                <AnimatePresence>
                    {pullDistance > 20 && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: Math.min(pullDistance / 100, 1), y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-4 left-0 right-0 flex flex-col items-center justify-center gap-1 z-10"
                        >
                            <div className={cn(
                                "p-2 rounded-full bg-accent-primary/20 border border-accent-primary/40 transition-transform",
                                pullDistance > 120 ? "scale-125 rotate-180" : ""
                            )}>
                                <RefreshCw size={16} className={cn("text-accent-primary", pullDistance > 120 ? "animate-spin" : "")} />
                            </div>
                            <span className="text-[10px] font-bold text-accent-primary uppercase tracking-widest">
                                {pullDistance > 120 ? 'Release for New Chat' : 'Pull for New Chat'}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Welcome View - Full Width */}
                {messages.length === 0 && (
                    <WelcomeView onSendMessage={handleSendMessage} />
                )}

                {/* Messages Container - Constrained Width */}
                {messages.length > 0 && (
                <div className="max-w-4xl mx-auto space-y-6 h-full flex flex-col">

                    {messages.map((msg, index) => (
                        <MessageBubble
                            key={`${msg.id}-${index}`}
                            message={msg}
                            isLast={index === messages.length - 1}
                            isGenerating={isGenerating && index === messages.length - 1 && msg.role === 'model'}
                            onEdit={handleEditMessage}
                            onRegenerate={handleRegenerate}
                            onOpenArtifact={handleOpenArtifact}
                            onSendMessage={handleSendMessage}
                        />
                    ))}

                    {/* Typing / Thinking Indicator */}
                    {(isGenerating || agentAction) && (
                        messages.length > 0 && messages[messages.length - 1].role === 'model' && messages[messages.length - 1].content === '' ? (
                            <MessageSkeleton />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="flex items-center gap-4 ml-12 bg-glass-bg/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-glass-border/50 max-w-fit shadow-lg shadow-black/10"
                            >
                                <div className="relative">
                                    <Atom size={16} className="animate-spin-slow text-violet-500 relative z-10" />
                                    <div className="absolute inset-0 bg-accent-primary/30 blur-lg rounded-full animate-pulse" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary animate-pulse">
                                        {agentAction || "Thinking..."}
                                    </span>
                                    {agentAction && (
                                        <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                                            Advanced Protocol Alpha
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        )
                    )}

                    <div ref={messagesEndRef} className="h-1" />
                </div>
                )}
            </div>

            {/* Input Area - Fixed at bottom, floats over messages */}
            <div className="absolute bottom-0 left-0 right-0 p-0 z-10 pointer-events-none">
                <div className="max-w-4xl mx-auto pointer-events-auto">
                    <InputArea onSendMessage={handleSendMessage} isGenerating={isGenerating} modelId={modelId} onModelChange={handleModelChange} onStop={handleStopGeneration} />

                    {/* Artifact Viewer Side Panel */}
                    <ArtifactViewer
                        isOpen={isArtifactOpen}
                        onClose={() => setIsArtifactOpen(false)}
                        code={artifactCode}
                        language={artifactLang}
                    />
                </div>

                <div className="flex justify-center items-center gap-4 pt-2 pb-2 text-[9px] pointer-events-auto">
                    <p className="text-[10px] text-foreground opacity-50">
                        AI can make mistakes. Please verify important information.
                    </p>
                    {messages.length > 0 && (
                        <>
                            <button
                                onClick={() => {
                                    const text = messages.map(m => `${m.role === 'user' ? 'YOU' : 'AI'}: ${m.content}`).join('\n\n');
                                    navigator.clipboard.writeText(text);
                                }}
                                className="text-[10px] text-violet-500 hover:text-violet-400 flex items-center gap-1 hover:scale-110 active:scale-95 transition-all"
                            >
                                <Copy size={10} /> Copy
                            </button>
                            <button
                                onClick={() => {
                                    const text = messages.map(m => `### ${m.role === 'user' ? 'YOU' : 'AI'}\n${m.content}`).join('\n\n---\n\n');
                                    const blob = new Blob([text], { type: 'text/markdown' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.md`;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                }}
                                className="text-[10px] text-violet-500 hover:text-violet-400 flex items-center gap-1 hover:scale-110 active:scale-95 transition-all ml-2"
                            >
                                <FileDown size={10} /> Export
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
