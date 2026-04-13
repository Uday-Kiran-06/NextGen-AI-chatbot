'use client';

import React, { useState, useRef, useEffect } from 'react';
import MessageBubble, { MessageSkeleton } from './MessageBubble';
import InputArea from './InputArea';
import WelcomeView from './WelcomeView';
import { Share2, Sparkles, Zap, Image as ImageIcon, Code, PenTool, Menu, Download, ChevronDown, RefreshCw, MessageSquarePlus, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, vibrate } from '@/lib/utils';
import { chatStore, Message as StoreMessage, Conversation } from '@/lib/chat-store';
import { useShortcuts } from '@/hooks/use-shortcuts';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { FileAttachment } from './types';
import { useChat } from '@/hooks/useChat';
import { AttractiveIcon } from '../Shared/AttractiveIcon';
import GlobalDropzone from '../Shared/GlobalDropzone';
import CommandPalette from '../Shared/CommandPalette';
import { toast } from 'sonner';

const ArtifactViewer = dynamic(() => import('./ArtifactViewer'), {
    ssr: false,
    loading: () => <div className="hidden">Loading Viewer...</div>
});

interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    content: string;
}



const MODELS = [
    { id: 'gemini-2.5-flash', label: 'Gemini 2.5', icon: Zap, desc: 'Fast & efficient' },
    { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', icon: Sparkles, desc: 'Deep reasoning' },
    { id: 'gemini-3-flash-preview', label: 'Gemini 3 Preview', icon: Sparkles, desc: 'Next-gen frontier model' },
    { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', icon: Zap, desc: 'Powerful Open Source' },
    { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7b', icon: Zap, desc: 'High-speed efficiency' },
    { id: 'ollama-llama3', label: 'Local (Ollama)', icon: Zap, desc: 'Private localhost:11434' },
];

interface ChatInterfaceProps {
    conversationId: string | null;
    onConversationCreated: (id: string) => void;
    onOpenSidebar?: () => void;
    onNewChat?: () => void;
    isZenMode?: boolean;
    onToggleZen?: () => void;
}

export default function ChatInterface({ conversationId, onConversationCreated, onOpenSidebar, onNewChat, isZenMode, onToggleZen }: ChatInterfaceProps) {
    const [modelId, setModelId] = useState('llama-3.3-70b-versatile');
    const activeModel = MODELS.find(m => m.id === modelId) || MODELS[0];
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { theme, setTheme } = useTheme();

    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
    const [isVoiceRecording, setIsVoiceRecording] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState('');

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
        onStopGeneration: handleStopGeneration,
        onOpenCommandPalette: () => setIsCommandPaletteOpen(true)
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

    const handleSummarize = async () => {
        if (messages.length < 2) {
            toast.error("Not enough messages to summarize!");
            return;
        }
        setIsCommandPaletteOpen(false);
        handleSendMessage("Please summarize our conversation so far into 3-5 concise bullet points. Focus on the main takeaways.", [], false);
    };

    return (
        <GlobalDropzone onFilesDropped={setDroppedFiles}>
            <div className="flex-1 flex flex-col h-full relative z-0 overflow-hidden">
                <CommandPalette 
                    isOpen={isCommandPaletteOpen}
                    onClose={() => setIsCommandPaletteOpen(false)}
                    onSelectChat={(id) => onConversationCreated(id)}
                    onNewChat={() => onNewChat?.()}
                    onModelChange={handleModelChange}
                    onSummarize={handleSummarize}
                />

            {/* Mobile Header - Sticky, Capsule, Floating */}
            <motion.div
                initial={false}
                animate={{
                    y: (showHeader && !isZenMode) ? 0 : -100,
                    opacity: (showHeader && !isZenMode) ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden absolute top-[calc(env(safe-area-inset-top,0px)+12px)] left-4 right-4 z-50 flex items-center justify-between px-4 py-2 bg-sidebar-bg/60 backdrop-blur-2xl border-[1.5px] border-white/10 rounded-2xl shadow-2xl ring-1 ring-white/5"
            >
                <button
                    onClick={onOpenSidebar}
                    className="p-2 -ml-2 rounded-xl transition-all active:scale-95 flex items-center justify-center relative z-10"
                    aria-label="Open Sidebar"
                >
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg active:bg-white/10">
                        <svg 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                d="M4 6H20M4 12H20M4 18H20" 
                                stroke="url(#mobile-menu-gradient)" 
                                strokeWidth="2.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                            <defs>
                                <linearGradient id="mobile-menu-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#db2777" />
                                    <stop offset="100%" stopColor="#9333ea" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="font-bold text-[13px] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">
                        NextGen AI
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-500 flex items-center gap-1">
                        <AttractiveIcon 
                            icon={Sparkles} 
                            size={10} 
                            gradient={['#9333ea', '#db2777']} 
                            glow 
                            strokeWidth={2}
                        />
                        {activeModel?.label || 'Gemini'}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => {
                            const text = messages.map(m => `### ${m.role === 'user' ? '👤 YOU' : '🤖 AI'}\n${m.content}`).join('\n\n---\n\n');
                            const blob = new Blob([text], { type: 'text/markdown' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `chat-export-${new Date().toISOString().split('T')[0]}.md`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                        className="p-2 mr-[-8px] rounded-xl text-gray-400 hover:text-white transition-all"
                        title="Export Markdown"
                    >
                        <AttractiveIcon icon={Download} size={18} />
                    </button>
                </div>
            </motion.div>

            {/* Zen Mode Floating Button */}
            <AnimatePresence>
                {isZenMode && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={onToggleZen}
                        className="fixed top-6 left-6 z-[100] p-3 rounded-2xl glass-panel border border-white/10 shadow-2xl hover:bg-white/5 transition-all group"
                        title="Exit Zen Mode (Ctrl + .)"
                    >
                        <AttractiveIcon icon={TrendingUp} size={20} className="rotate-[-90deg] text-accent-primary" />
                        <span className="absolute left-full ml-3 px-3 py-1 bg-black/80 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">EXT ZEN MODE</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Voice Status Indicator logic moved down to InputArea wrapper for perfect centering */}

            {/* ChatMessages Area */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-4 relative touch-pan-y"
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
                <div className="max-w-4xl mx-auto space-y-6 h-full flex flex-col">

                    {/* Welcome View */}
                    {messages.length === 0 && (
                        <WelcomeView onSendMessage={handleSendMessage} />
                    )}

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
                                    <AttractiveIcon 
                                        icon={Sparkles} 
                                        size={18} 
                                        gradient={['#9333ea', '#db2777']} 
                                        glow 
                                        strokeWidth={1.5}
                                    />
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

                {/* Floating Scroll Pill removed as per request */}
            </div>

            {/* Input Area */}
            <div className="p-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10 relative">
                {/* Voice Status Indicator - Corrected for Perfect Centering in Chat Area */}
                <div className="absolute bottom-full left-0 right-0 flex justify-center pb-4 z-[100] pointer-events-none">
                    <AnimatePresence>
                        {isVoiceRecording && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                className="bg-black/90 backdrop-blur-xl text-white px-5 py-3 rounded-[24px] flex flex-col items-center gap-2 border border-white/5 shadow-2xl min-w-[140px]"
                            >
                                <div className="flex gap-1.5 items-end h-5">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <motion.div 
                                            key={i} 
                                            animate={{ height: [4, 16, 4] }}
                                            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                                            className="w-1.5 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.6)]" 
                                        />
                                    ))}
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Listening</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="max-w-4xl mx-auto relative px-4">
                    <InputArea 
                        onSendMessage={handleSendMessage} 
                        isGenerating={isGenerating} 
                        modelId={modelId} 
                        onModelChange={handleModelChange} 
                        onStop={handleStopGeneration} 
                        externalFiles={droppedFiles}
                        onClearExternalFiles={() => setDroppedFiles([])}
                        onVoiceStateChange={(isRec, trans) => {
                            setIsVoiceRecording(isRec);
                            setVoiceTranscript(trans);
                        }}
                    />

                    {/* Artifact Viewer Side Panel */}
                    <ArtifactViewer
                        isOpen={isArtifactOpen}
                        onClose={() => setIsArtifactOpen(false)}
                        code={artifactCode}
                        language={artifactLang}
                    />
                </div>
 
                <div className="flex justify-center items-center gap-4 mt-0.5 mb-1 text-[9px]">
                    <p className="text-[10px] text-foreground opacity-50">
                        AI can make mistakes. Please verify important information.
                    </p>
                    {messages.length > 0 && (
                        <>
                            <button
                                onClick={() => {
                                    const text = messages.map(m => `${m.role === 'user' ? 'YOU' : 'AI'}: ${m.content}`).join('\n\n');
                                    navigator.clipboard.writeText(text);
                                    toast.success('Conversation copied to clipboard');
                                }}
                                className="text-[10px] text-accent-secondary hover:text-accent-primary flex items-center gap-1.5 hover:scale-110 active:scale-95 transition-all"
                            >
                                <AttractiveIcon icon={Share2} size={10} gradient={['#db2777', '#7c3aed']} /> Copy Link
                            </button>
                            <button
                                onClick={() => {
                                    const text = messages.map(m => `### ${m.role === 'user' ? '👤 YOU' : '🤖 AI'}\n${m.content}`).join('\n\n---\n\n');
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
                                className="text-[10px] text-accent-secondary hover:text-accent-primary flex items-center gap-1.5 hover:scale-110 active:scale-95 transition-all ml-2"
                            >
                                <AttractiveIcon icon={Download} size={10} gradient={['#db2777', '#7c3aed']} /> Export (.md)
                            </button>
                        </>
                    )}
                </div>
            </div>
            </div>
        </GlobalDropzone>
    );
}
