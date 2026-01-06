'use client';

import React, { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { Share2 } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'model', content: 'Hello! I am NextGen, your advanced AI assistant. I can help you with analysis, coding, creative writing, and more. Try uploading a document or image!' }
    ]);
    const [isGenerating, setIsGenerating] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (text: string, files: any[]) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text + (files.length > 0 ? `\n[Attached ${files.length} file(s)]` : '')
        };

        setMessages(prev => [...prev, userMessage]);
        setIsGenerating(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: messages.slice(1), // Exclude initial greeting if needed, or include
                    message: text,
                    layers: files
                })
            });

            if (!response.ok || !response.body) {
                throw new Error('Network response was not ok');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiMessageContent = '';
            const aiMessageId = (Date.now() + 1).toString();

            setMessages(prev => [...prev, { id: aiMessageId, role: 'model', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const textChunk = decoder.decode(value, { stream: true });
                aiMessageContent += textChunk;

                setMessages(prev => prev.map(msg =>
                    msg.id === aiMessageId ? { ...msg, content: aiMessageContent } : msg
                ));
            }

        } catch (error) {
            console.error('Error generating response:', error);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShare = () => {
        const text = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
        navigator.clipboard.writeText(text);
        alert('Conversation copied to clipboard!');
    };

    return (
        <div className="flex-1 flex flex-col h-full relative z-0">
            <header className="flex items-center justify-between p-4 glass-panelm border-b border-white/5 md:hidden">
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-pink-200">NextGen</span>
            </header>

            {/* Share Button (Desktop Absolute) */}
            <button
                onClick={handleShare}
                className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-lg transition-colors hidden md:block"
                title="Copy Conversation"
            >
                <Share2 size={18} />
            </button>

            <MessageList messages={messages} />
            <div ref={messagesEndRef} />

            <InputArea onSendMessage={handleSendMessage} isGenerating={isGenerating} />
        </div>
    );
}
