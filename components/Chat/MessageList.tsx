import React from 'react';
import MessageBubble from './MessageBubble';

interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
}

interface MessageListProps {
    messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-hide">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-accent-primary to-accent-secondary blur-xl mb-4" />
                    <h2 className="text-2xl font-bold mb-2">NextGen AI</h2>
                    <p className="max-w-md text-sm">How can I help you today?</p>
                </div>
            ) : (
                messages.map((msg) => (
                    <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
                ))
            )}
        </div>
    );
}
