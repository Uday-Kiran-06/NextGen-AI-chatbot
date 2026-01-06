'use client';

import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import { Share2, Sparkles, Zap, Image as ImageIcon, Code, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
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
}

export default function ChatInterface({ conversationId, onConversationCreated }: ChatInterfaceProps) {
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
                    // If parse fails, it's likely an HTML error page (500)
                    console.error("Non-JSON Server Error:", errorText);
                    throw new Error(`Server Error (${response.status}): ${response.statusText}`);
                }

                console.error("Server Error:", errorData);
                throw new Error(errorData.error || 'Network response was not ok');
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

        } catch (error) {
            console.error('Error generating response:', error);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: 'Sorry, I encountered an error. Please check your connection or API key.' }]);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full relative z-0 overflow-hidden">

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide pt-20 md:pt-4">
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
                                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/50 relative z-10">
                                    NextGen AI
                                </h1>
                                <p className="text-gray-400 mt-4 text-lg max-w-md mx-auto">
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
                                        className="flex flex-col items-center gap-3 p-4 rounded-2xl glass-panel border-white/5 hover:border-accent-primary/50 hover:bg-white/5 transition-all group"
                                    >
                                        <div className="p-3 rounded-full bg-white/5 group-hover:bg-accent-primary/20 group-hover:text-accent-primary transition-colors">
                                            <item.icon size={20} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-300 group-hover:text-white">{item.label}</span>
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
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-gray-400 ml-12"
                        >
                            <Sparkles size={16} className="animate-spin-slow text-accent-primary" />
                            <span className="text-xs font-medium animate-pulse">Thinking...</span>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-gradient-to-t from-background via-background/80 to-transparent z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Share Button (moved near input or keep in header? Let's add a small floating action or just keep input) */}
                    {/* Actually, let's add a Share button to the top right of the chat area, or maybe near the input helper text */}

                    <InputArea onSendMessage={handleSendMessage} isGenerating={isGenerating} />
                    <div className="flex justify-center items-center gap-4 mt-3">
                        <p className="text-[10px] text-gray-500">
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
