'use client';

import React, { useState, useRef, useEffect } from 'react';
import MessageBubble, { MessageSkeleton } from './MessageBubble';
import InputArea from './InputArea';
import { Share2, Sparkles, Zap, Image as ImageIcon, Code, PenTool, Menu, Download, ChevronDown, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, vibrate } from '@/lib/utils';
import { chatStore, Message as StoreMessage, Conversation } from '@/lib/chat-store';
import { useShortcuts } from '@/hooks/use-shortcuts';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';

const ArtifactViewer = dynamic(() => import('./ArtifactViewer'), {
    ssr: false,
    loading: () => <div className="hidden">Loading Viewer...</div>
});

interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    content: string;
}

const QUICK_PROMPTS = [
    { icon: Zap, label: 'Analyze Data', prompt: 'Please analyze this technical data for me.', color: 'text-violet-400' },
    { icon: ImageIcon, label: 'Generate Image', prompt: 'Create a futuristic cyberpunk cityscape.', color: 'text-pink-400' },
    { icon: Code, label: 'Debug Code', prompt: 'Help me debug this React component.', color: 'text-cyan-400' },
    { icon: PenTool, label: 'Write Story', prompt: 'Write a short science fiction story about AI.', color: 'text-amber-400' },
];

const MODELS = [
    { id: 'gemini-2.5-flash', label: 'Flash 2.5', icon: Zap, desc: 'Fast & efficient' },
    { id: 'gemini-2.5-pro', label: 'Pro 2.5', icon: Sparkles, desc: 'Deep reasoning' },
    { id: 'gemini-3-flash-preview', label: 'G3 Preview', icon: Sparkles, desc: 'Next-gen frontier model' },
];

interface ChatInterfaceProps {
    conversationId: string | null;
    onConversationCreated: (id: string) => void;
    onOpenSidebar?: () => void;
    onNewChat?: () => void;
}

export default function ChatInterface({ conversationId, onConversationCreated, onOpenSidebar, onNewChat }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [agentAction, setAgentAction] = useState<string | null>(null);
    const [modelId, setModelId] = useState('gemini-2.5-flash');
    const activeModel = MODELS.find(m => m.id === modelId) || MODELS[0];
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const { theme, setTheme } = useTheme();

    // Round 3: Scroll & Gesture States
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [pullDistance, setPullDistance] = useState(0);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const handleStopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    };

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
        onToggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark')
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

    // Load messages when conversationId changes
    useEffect(() => {
        const loadMessages = async () => {
            if (conversationId) {
                // Prevent wiping out the "Thinking..." state if we are currently generating.
                // The new message will be added via state updates in generateAIResponse.
                if (isGenerating) {
                    console.log('Skipping message load during generation to preserve state');
                    return;
                }
                const dbMessages = await chatStore.getMessages(conversationId);
                setMessages(dbMessages.map(m => ({ id: m.id, role: m.role, content: m.content })));
            } else {
                setMessages([]);
            }
        };
        loadMessages();
    }, [conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const generateAIResponse = async (history: ChatMessage[], userInput: string, files: any[] = []) => {
        setIsGenerating(true);
        let currentConvoId = conversationId;

        // Create conversation if it doesn't exist
        if (!currentConvoId) {
            const shortTitle = userInput.slice(0, 30) + (userInput.length > 30 ? '...' : '');
            const newConvo = await chatStore.createConversation(shortTitle);
            if (newConvo) {
                currentConvoId = newConvo.id;
                // CRITICAL: Save the initial user message to DB *before* triggering the parent update.
                // This prevents the "disappearing message" bug where the UI reloads from an empty DB.
                await chatStore.addMessage(currentConvoId, 'user', userInput);
                onConversationCreated(newConvo.id);
            }
        }

        // Save User ChatMessage to DB is handled by caller or assumed done

        // --- DIRECT IMAGE GENERATION COMMAND (/image) ---
        // Bypasses Gemini API to save quota or work offline
        if (userInput.trim().toLowerCase().startsWith('/image')) {
            try {
                const prompt = userInput.replace(/^\/image\s*/i, '').trim() || "random abstract art";

                let imageUrl = '';

                try {
                    console.log('Fetching secure image URL...');
                    const response = await fetch('/api/image', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt })
                    });

                    if (!response.ok) {
                        const errText = await response.text();
                        throw new Error(`API Error (${response.status}): ${errText}`);
                    }

                    const data = await response.json();
                    imageUrl = data.imageUrl;
                    console.log('Secure image URL received:', imageUrl);

                } catch (apiError) {
                    console.error('Secure image generation failed, falling back to client-side:', apiError);

                    // Fallback to client-side generation (may have watermark)
                    const encodedPrompt = encodeURIComponent(prompt.slice(0, 500));
                    const seed = Math.floor(Math.random() * 1000000);
                    // Fallback: Use client-side generation with hardcoded key
                    const apiKey = 'sk_mEWxPjZizTEUPa1FsEFasSWkowb0Yzlt';
                    imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true&key=${apiKey}`;
                }

                if (!imageUrl) throw new Error('Failed to generate image URL');

                const aiChatMessageContent = `![Generated Image](${imageUrl})\n\n_Generated via direct command: "${prompt}"_`;

                // Add AI ChatMessage to State
                const aiChatMessageId = (Date.now() + 1).toString();
                setMessages(prev => [...prev, { id: aiChatMessageId, role: 'model', content: aiChatMessageContent }]);

                // Save to DB
                if (currentConvoId) {
                    chatStore.addMessage(currentConvoId, 'model', aiChatMessageContent);
                }
            } catch (err) {
                console.error("Image command failed", err);
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: 'Sorry, I encountered an error generating the image.' }]);
            } finally {
                setIsGenerating(false);
            }
            return; // Exit function, do not call Gemini
        }

        let aiChatMessageId = '';
        let aiChatMessageContent = '';

        try {
            abortControllerRef.current = new AbortController();
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: history,
                    message: userInput,
                    layers: files,
                    persona: localStorage.getItem('nextgen_persona') || 'Standard AI',
                    modelId: modelId
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    console.error("Non-JSON Server Error:", errorText);
                    throw new Error(`Server Error (${response.status}): ${response.statusText}`);
                }
                console.error("Server Error:", errorData);
                throw new Error(errorData.error || 'Network response was not ok');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No reader available');

            aiChatMessageId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { id: aiChatMessageId, role: 'model', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const textChunk = decoder.decode(value, { stream: true });

                // Intercept Agent Actions
                if (textChunk.includes('__AGENT_ACTION__::')) {
                    // Handle potential prefix baggage if chunks are merged
                }

                if (textChunk.startsWith('__AGENT_ACTION__:')) {
                    const action = textChunk.replace('__AGENT_ACTION__:', '');
                    setAgentAction(action);
                    continue; // Don't add to message content
                }

                // If we get real content, clear the action status
                setAgentAction(null);
                aiChatMessageContent += textChunk;

                setMessages(prev => prev.map(msg =>
                    msg.id === aiChatMessageId ? { ...msg, content: aiChatMessageContent } : msg
                ));
            }

            // Save AI ChatMessage to DB
            if (currentConvoId) {
                chatStore.addMessage(currentConvoId, 'model', aiChatMessageContent);
            }

        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Generation stopped by user');
                // Save partial message to DB
                if (currentConvoId && aiChatMessageContent) {
                    chatStore.addMessage(currentConvoId, 'model', aiChatMessageContent + '\n\n_[Stopped by User]_');
                }
                setMessages(prev => prev.map(msg =>
                    msg.id === aiChatMessageId ? { ...msg, content: aiChatMessageContent + '\n\n_[Stopped by User]_' } : msg
                ));
                return;
            }
            console.error('Error generating response:', error);
            setAgentAction(null);
            const errorChatMessage = error.message || 'Sorry, I encountered an error. Please check your connection or API key.';
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: `Error: ${errorChatMessage}` }]);
        } finally {
            setIsGenerating(false);
            setAgentAction(null);
            abortControllerRef.current = null;
        }
    };

    const handleSendMessage = async (text: string, files: any[]) => {
        const tempId = Date.now().toString();

        let messageContent = '';
        const imageFiles = files.filter(f => f.mimeType.startsWith('image/'));
        const otherFiles = files.filter(f => !f.mimeType.startsWith('image/'));

        // Inline Images (Markdown)
        if (imageFiles.length > 0) {
            imageFiles.forEach(file => {
                messageContent += `![Image](${file.preview})\n\n`;
            });
        }

        // Add Text
        if (text.trim()) {
            messageContent += text.trim();
        }

        // Other Attachments Note
        if (otherFiles.length > 0) {
            if (messageContent) messageContent += '\n\n';
            messageContent += `*Attached ${otherFiles.length} other file(s)*`;
        }

        const userChatMessage: ChatMessage = {
            id: tempId,
            role: 'user',
            content: messageContent
        };

        const newChatMessages = [...messages, userChatMessage];
        setMessages(newChatMessages);

        // Save User ChatMessage to DB
        if (conversationId) {
            chatStore.addMessage(conversationId, 'user', userChatMessage.content);
        }

        // Handle Document Uploads (RAG)
        if (otherFiles.length > 0) {
            setIsGenerating(true);
            try {
                for (const file of otherFiles) {
                    const uploadRes = await fetch('/api/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            fileName: file.name,
                            mimeType: file.mimeType,
                            fileData: file.data,
                            conversationId: conversationId
                        })
                    });

                    if (!uploadRes.ok) {
                        const errText = await uploadRes.text();
                        throw new Error(`Failed to process ${file.name}: ${errText}`);
                    }
                }
            } catch (err: any) {
                console.error("Document Upload Error:", err);
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: `❌ Error uploading document: ${err.message}` }]);
                setIsGenerating(false);
                return; // Stop process if upload fails
            }
        }

        await generateAIResponse(newChatMessages, userChatMessage.content, imageFiles);
    };

    const handleEditMessage = async (id: string, newContent: string) => {
        // 1. Find the index of the message being edited
        const messageIndex = messages.findIndex(m => m.id === id);
        if (messageIndex === -1) return;

        // 2. Truncate history: Keep messages UP TO the edited one
        const truncatedHistory = messages.slice(0, messageIndex);

        // 3. Create the updated user message
        const updatedChatMessage = {
            ...messages[messageIndex],
            content: newContent
        };

        // 4. Update state: New history + updated message. 
        // effectively removing all subsequent messages.
        const newChatMessages = [...truncatedHistory, updatedChatMessage];
        setMessages(newChatMessages);

        // TODO: Database Cleanup
        // Ideally, we should also delete messages in the DB that came after this timestamp
        // to keep the saved state consistent with the UI. 
        // For now, we focus on the UI flow.
        if (conversationId) {
            // Update the edited message in DB
            // await chatStore.updateChatMessage(...)
            // Delete subsequent messages
            // await chatStore.deleteChatMessagesAfter(...)
        }

        // 5. Trigger regeneration
        // Note: We pass 'truncatedHistory' as the context, and newContent as the 'latest input'
        await generateAIResponse(truncatedHistory, newContent, []);
    };

    const handleRegenerate = async () => {
        if (messages.length < 2) return; // Need at least user + AI

        // Find the last user message
        let lastUserChatMessageIndex = -1;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === 'user') {
                lastUserChatMessageIndex = i;
                break;
            }
        }

        if (lastUserChatMessageIndex === -1) return;

        // Context is everything BEFORE the last user message
        const truncatedHistory = messages.slice(0, lastUserChatMessageIndex);
        const lastUserInput = messages[lastUserChatMessageIndex].content;

        // Keep history up to the user message
        setMessages(messages.slice(0, lastUserChatMessageIndex + 1));

        await generateAIResponse(truncatedHistory, lastUserInput, []);
    };

    const [showScrollPill, setShowScrollPill] = useState(false);
    const lastScrollTime = useRef<number>(0);

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

        const now = Date.now();
        // Throttle scroll events to 100ms
        if (now - lastScrollTime.current < 100) return;
        lastScrollTime.current = now;

        const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
        setShowScrollPill(!isAtBottom);
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
                className="md:hidden absolute top-[calc(env(safe-area-inset-top,0px)+12px)] left-3 right-3 z-50 flex items-center justify-between px-4 py-2.5 bg-background/80 backdrop-blur-xl border border-glass-border rounded-2xl shadow-lg ring-1 ring-white/10"
            >
                <button
                    onClick={onOpenSidebar}
                    className="p-2 -ml-2 text-foreground opacity-70 hover:opacity-100 hover:scale-110 active:scale-95 transition-all rounded-xl hover:bg-white/5"
                    aria-label="Open Sidebar"
                >
                    <Menu size={20} />
                </button>
                <div className="flex flex-col items-center">
                    <div className="font-bold text-[13px] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">
                        NextGen AI
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-500 flex items-center gap-1">
                        <Sparkles size={8} className="text-accent-primary animate-pulse" />
                        {activeModel?.label || 'Gemini'}
                    </div>
                </div>
                <button
                    onClick={onNewChat}
                    className="p-2 -mr-2 text-foreground opacity-70 hover:opacity-100 hover:scale-110 active:scale-95 transition-all rounded-xl hover:bg-white/5"
                    aria-label="New Chat"
                >
                    <Share2 size={18} />
                </button>
            </motion.div>

            {/* ChatMessages Area */}
            <motion.div
                ref={chatContainerRef}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.4}
                onDrag={(_, info) => {
                    if (chatContainerRef.current && chatContainerRef.current.scrollTop <= 0) {
                        setPullDistance(info.offset.y);
                    }
                }}
                onDragEnd={() => {
                    if (pullDistance > 120) {
                        onNewChat?.();
                        vibrate([10, 50, 10]);
                    }
                    setPullDistance(0);
                }}
                className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide pt-20 md:pt-4 relative touch-pan-y"
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
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 min-h-[50vh]">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="relative"
                            >
                                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary blur-2xl opacity-20 animate-pulse-slow" />
                                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground to-foreground/50 relative z-10">
                                    NextGen AI
                                </h1>
                                <p className="text-gray-500 mt-4 text-lg max-w-md mx-auto">
                                    Your advanced assistant for analysis, creativity, and development.
                                </p>
                            </motion.div>

                            <motion.div
                                className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl px-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                {QUICK_PROMPTS.map((item, i) => (
                                    <motion.button
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
                                        onClick={() => handleSendMessage(item.prompt, [])}
                                        className="flex flex-col items-center gap-3 p-4 rounded-2xl glass-panel border-glass-border hover:bg-glass-shimmer transition-all duration-300 group hover:shadow-2xl hover:border-accent-primary/50"
                                    >

                                        <div className={`p-3 rounded-xl bg-glass-bg ${item.color} group-hover:bg-glass-shimmer transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                            <item.icon size={20} />
                                        </div>
                                        <span className="text-xs font-bold text-foreground/70 group-hover:text-foreground transition-all duration-300">{item.label}</span>
                                    </motion.button>
                                ))}
                            </motion.div>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isLast={index === messages.length - 1}
                            onEdit={handleEditMessage}
                            onRegenerate={handleRegenerate}
                            onOpenArtifact={handleOpenArtifact}
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
                                    <Sparkles size={16} className="animate-spin-slow text-accent-primary relative z-10" />
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

                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Floating Scroll Pill */}
                <AnimatePresence>
                    {showScrollPill && (
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            onClick={scrollToBottom}
                            className="fixed bottom-32 left-1/2 -translate-x-1/2 px-4 py-2 bg-accent-primary text-white rounded-full shadow-2xl flex items-center gap-2 hover:scale-110 active:scale-95 transition-all z-20 group"
                        >
                            <span className="text-xs font-bold tracking-wide">New Messages</span>
                            <ChevronDown size={14} className="group-hover:animate-bounce" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-gradient-to-t from-background via-background/80 to-transparent z-10">
                <div className="max-w-4xl mx-auto">
                    <InputArea onSendMessage={handleSendMessage} isGenerating={isGenerating} modelId={modelId} onModelChange={handleModelChange} onStop={handleStopGeneration} />

                    {/* Artifact Viewer Side Panel */}
                    <ArtifactViewer
                        isOpen={isArtifactOpen}
                        onClose={() => setIsArtifactOpen(false)}
                        code={artifactCode}
                        language={artifactLang}
                    />
                </div>

                <div className="flex justify-center items-center gap-4 mt-3">
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
                                className="text-[10px] text-accent-secondary hover:text-accent-primary flex items-center gap-1 hover:scale-110 active:scale-95 transition-all"
                            >
                                <Share2 size={10} /> Copy Chat
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
                                className="text-[10px] text-accent-secondary hover:text-accent-primary flex items-center gap-1 hover:scale-110 active:scale-95 transition-all ml-2"
                            >
                                <Download size={10} /> Export (.md)
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
