'use client';

import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import { Share2, Sparkles, Zap, Image as ImageIcon, Code, PenTool, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { chatStore, Message as DBMessage } from '@/lib/chat-store';
import { Button } from '@/components/ui/button';

interface Message {
    id: string;
    role: 'user' | 'model' | 'tool';
    content: string;
}

const QUICK_PROMPTS = [
    { icon: Zap, label: 'Analyze Data', prompt: 'Please analyze this technical data for me.', color: 'text-violet-400' },
    { icon: ImageIcon, label: 'Generate Image', prompt: 'Create a futuristic cyberpunk cityscape.', color: 'text-pink-400' },
    { icon: Code, label: 'Debug Code', prompt: 'Help me debug this React component.', color: 'text-cyan-400' },
    { icon: PenTool, label: 'Write Story', prompt: 'Write a short science fiction story about AI.', color: 'text-amber-400' },
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

    const generateAIResponse = async (history: Message[], userInput: string, files: any[] = []) => {
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

        // --- DIRECT IMAGE GENERATION COMMAND (/image) ---
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

                } catch (apiError) {
                    console.error('Secure image generation failed, falling back to client-side:', apiError);
                    // Fallback using direct poll URL (for demo purposes if API fails)
                    const encodedPrompt = encodeURIComponent(prompt.slice(0, 500));
                    const seed = Math.floor(Math.random() * 1000000);
                    const apiKey = 'sk_mEWxPjZizTEUPa1FsEFasSWkowb0Yzlt';
                    imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true&key=${apiKey}`;
                }

                if (!imageUrl) throw new Error('Failed to generate image URL');

                const aiMessageContent = `![Generated Image](${imageUrl})\n\n_Generated via direct command: "${prompt}"_`;

                // Add AI Message to State
                const aiMessageId = (Date.now() + 1).toString();
                setMessages(prev => [...prev, { id: aiMessageId, role: 'model', content: aiMessageContent }]);

                // Save to DB
                if (currentConvoId) {
                    chatStore.addMessage(currentConvoId, 'model', aiMessageContent);
                }
            } catch (err) {
                console.error("Image command failed", err);
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: 'Sorry, I encountered an error generating the image.' }]);
            } finally {
                setIsGenerating(false);
            }
            return;
        }

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: history,
                    message: userInput,
                    layers: files
                })
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

        } catch (error: any) {
            console.error('Error generating response:', error);
            const errorMessage = error.message || 'Sorry, I encountered an error. Please check your connection or API key.';
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: `Error: ${errorMessage}` }]);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSendMessage = async (text: string, files: any[]) => {
        const tempId = Date.now().toString();

        let messageContent = '';
        const imageFiles = files.filter(f => f.mimeType.startsWith('image/'));
        const otherFiles = files.filter(f => !f.mimeType.startsWith('image/'));

        // Inline Images
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

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);

        if (conversationId) {
            chatStore.addMessage(conversationId, 'user', userMessage.content);
        }

        await generateAIResponse(messages, userMessage.content, files);
    };

    const handleEditMessage = async (id: string, newContent: string) => {
        const messageIndex = messages.findIndex(m => m.id === id);
        if (messageIndex === -1) return;

        const truncatedHistory = messages.slice(0, messageIndex);
        const updatedMessage = {
            ...messages[messageIndex],
            content: newContent
        };

        const newMessages = [...truncatedHistory, updatedMessage];
        setMessages(newMessages);

        if (conversationId) {
            // Future DB cleanup logic here
        }

        await generateAIResponse(truncatedHistory, newContent, []);
    };

    return (
        <div className="flex-1 flex flex-col h-full relative z-0 overflow-hidden">
            {/* Mobile Header - Sticky, Capsule */}
            <div className="md:hidden absolute top-4 left-4 right-4 z-50 flex items-center justify-between px-4 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-lg">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onOpenSidebar}
                    className="text-gray-300 hover:text-white"
                >
                    <Menu size={20} />
                </Button>
                <div className="font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-accent to-violet-500">
                    NextGen AI
                </div>
                <div className="w-9" /> {/* Placeholder for balance */}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide pt-20 md:pt-4">
                <div className="max-w-4xl mx-auto space-y-8 h-full flex flex-col">

                    {/* Welcome View */}
                    {messages.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 min-h-[50vh]">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="relative group cursor-default"
                            >
                                <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-accent to-violet-600 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-1000 animate-pulse-slow" />
                                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40 relative z-10 tracking-tight">
                                    NextGen AI
                                </h1>
                                <p className="text-muted-foreground mt-4 text-lg max-w-md mx-auto">
                                    Your advanced cognitive assistant. <br />
                                    <span className="text-sm">Powered by Gemini 2.0</span>
                                </p>
                            </motion.div>

                            <motion.div
                                className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl px-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                {QUICK_PROMPTS.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSendMessage(item.prompt, [])}
                                        className="flex flex-col items-center gap-4 p-6 rounded-2xl glass-panel border-white/5 hover:border-accent/50 hover:bg-white/5 hover:scale-105 transition-all group duration-300"
                                    >
                                        <div className={`p-4 rounded-full bg-white/5 ${item.color} group-hover:bg-white/10 group-hover:shadow-[0_0_15px_-5px_currentColor] transition-all`}>
                                            <item.icon size={24} />
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
                            onEdit={handleEditMessage}
                        />
                    ))}

                    {/* Typing Indicator */}
                    {isGenerating && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 text-muted-foreground ml-12"
                        >
                            <div className="flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                            </div>
                            <span className="text-xs font-medium tracking-wide">Computing...</span>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent z-10 w-full backdrop-blur-sm">
                <div className="max-w-4xl mx-auto w-full">
                    <InputArea onSendMessage={handleSendMessage} isGenerating={isGenerating} />
                </div>
            </div>
        </div>
    );
}
