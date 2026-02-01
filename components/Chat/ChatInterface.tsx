'use client';

import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import { Share2, Zap, Image as ImageIcon, Code, PenTool, Menu, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, getFriendlyErrorMessage } from '@/lib/utils';
import { chatStore, Message as DBMessage } from '@/lib/chat-store';

interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
}

const QUICK_PROMPTS = [
    { icon: Zap, label: 'Analyze Data', prompt: 'Please analyze this technical data for me.' },
    { icon: ImageIcon, label: 'Generate Image', prompt: 'Create a futuristic cyberpunk cityscape.' },
    { icon: Code, label: 'Debug Code', prompt: 'Help me debug this React component.' },
    { icon: PenTool, label: 'Write Story', prompt: 'Write a short science fiction story about AI.' },
];

interface ChatInterfaceProps {
    conversationId: string | null;
    onConversationCreated: (id: string) => void;
    onOpenSidebar?: () => void;
}

export default function ChatInterface({ conversationId, onConversationCreated, onOpenSidebar }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Load messages when conversationId changes
    useEffect(() => {
        const loadMessages = async () => {
            if (conversationId) {
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

    const handleSendMessage = async (text: string, files: any[]) => {
        const tempId = Date.now().toString();

        let messageContent = '';
        const imageFiles = files.filter(f => f.mimeType.startsWith('image/'));
        const otherFiles = files.filter(f => !f.mimeType.startsWith('image/'));

        // Inline Images (Markdown) - Prepend to appear at top
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

        const userMessage: Message = {
            id: tempId,
            role: 'user',
            content: messageContent
        };

        setMessages(prev => [...prev, userMessage]);
        setIsGenerating(true);

        let currentConvoId = conversationId;

        // Create conversation if it doesn't exist
        if (!currentConvoId) {
            const shortTitle = text.slice(0, 30) + (text.length > 30 ? '...' : '');
            const newConvo = await chatStore.createConversation(shortTitle);
            if (newConvo) {
                currentConvoId = newConvo.id;
                onConversationCreated(newConvo.id);
            }
        }

        // Save User Message to DB
        if (currentConvoId) {
            chatStore.addMessage(currentConvoId, 'user', userMessage.content);
        }

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: messages,
                    message: text,
                    layers: files
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorData;

                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    throw new Error(`Server Error (${response.status}): ${response.statusText}`);
                }

                throw new Error(errorData.error || `Server Error: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No reader available');

            const aiMessageId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { id: aiMessageId, role: 'model', content: '' }]);

            let aiMessageContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const textChunk = decoder.decode(value, { stream: true });
                aiMessageContent += textChunk;

                setMessages(prev => prev.map(msg =>
                    msg.id === aiMessageId ? { ...msg, content: aiMessageContent } : msg
                ));
            }

            // Save AI Message to DB
            if (currentConvoId) {
                chatStore.addMessage(currentConvoId, 'model', aiMessageContent);
            }

        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error generating response:', error);
            }

            const errorMessage = getFriendlyErrorMessage(error);

            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: errorMessage }]);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full relative z-0 overflow-hidden">
            {/* Mobile Header */}
            {/* Mobile Header - Sticky, Capsule, Floating */}
            <div className="md:hidden absolute top-4 left-4 right-4 z-50 flex items-center justify-between px-4 py-3 bg-surface-container/90 backdrop-blur-md rounded-full shadow-md elevation-1">
                <button
                    onClick={onOpenSidebar}
                    className="p-1 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                    <Menu size={20} />
                </button>
                <div className={cn("font-bold text-sm text-on-surface transition-opacity duration-300", messages.length === 0 ? "opacity-0" : "opacity-100")}>
                    QUBIT AI
                </div>
                <div className="w-5" /> {/* Placeholder for balance */}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 md:p-8 scrollbar-hide pt-20 md:pt-4">
                <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 h-full flex flex-col w-full">

                    {/* Welcome View */}
                    {messages.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-start md:justify-center text-center space-y-4 md:space-y-8 min-h-[50vh] pt-4 md:pt-0 w-full">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="relative flex flex-col items-center gap-4 md:gap-6"
                            >
                                <div className="absolute -inset-20 rounded-full bg-primary/10 blur-3xl opacity-50 pointer-events-none" />

                                <div className="relative w-20 h-20 md:w-32 md:h-32 shadow-2xl rounded-3xl overflow-hidden bg-surface-container-high border border-white/5 p-0 elevation-3 flex items-center justify-center">
                                    <img
                                        src="/logo.png"
                                        alt="QUBIT AI"
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                <h1 className="text-3xl md:text-5xl font-medium text-on-surface relative z-10 tracking-tight">
                                    QUBIT AI
                                </h1>
                                <p className="text-on-surface-variant mt-2 md:mt-4 text-sm md:text-lg max-w-md mx-auto px-4">
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
                                    <button
                                        key={i}
                                        onClick={() => handleSendMessage(item.prompt, [])}
                                        className="flex flex-col items-center gap-3 p-4 rounded-[16px] bg-surface-container-high hover:bg-surface-container-highest transition-all group shadow-sm hover:shadow-md active:scale-95 interactable"
                                    >
                                        <div className="p-3 rounded-full bg-blue-700 text-white group-hover:bg-blue-600 transition-colors">
                                            <item.icon size={20} />
                                        </div>
                                        <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface">{item.label}</span>
                                    </button>
                                ))}
                            </motion.div>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isLast={index === messages.length - 1}
                        />
                    ))}

                    {/* Typing Indicator */}
                    {isGenerating && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-start gap-4 mb-4"
                        >
                            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-white/5 shadow-sm">
                                <Brain size={18} className="text-secondary animate-pulse" />
                            </div>
                            <div className="bg-surface-container-high/50 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-1 shadow-sm">
                                <div className="w-2 h-2 bg-accent-primary opacity-60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-2 h-2 bg-accent-primary opacity-60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-2 h-2 bg-accent-primary opacity-60 rounded-full animate-bounce" />
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Input Area */}
            <div className="z-10 w-full mb-2">
                <div className="max-w-4xl mx-auto">
                    {/* Share Button (moved near input or keep in header? Let's add a small floating action or just keep input) */}
                    {/* Actually, let's add a Share button to the top right of the chat area, or maybe near the input helper text */}

                    <InputArea onSendMessage={handleSendMessage} isGenerating={isGenerating} />
                    <div className="flex justify-center items-center gap-4 mt-3">
                        <p className="text-[10px] text-on-surface-variant">
                            AI can make mistakes. Please verify important information.
                        </p>
                        {messages.length > 0 && (
                            <button
                                onClick={() => {
                                    const text = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
                                    navigator.clipboard.writeText(text);
                                    alert('Conversation copied to clipboard!');
                                }}
                                className="text-[10px] text-accent-secondary hover:text-accent-primary flex items-center gap-1 transition-colors"
                            >
                                <Share2 size={10} /> Share
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
