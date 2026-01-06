import React from 'react';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
    role: 'user' | 'model';
    content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
    const isUser = role === 'user';

    return (
        <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] md:max-w-[70%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
          ${isUser ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-glass-panel border border-white/10'}`}>
                    {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-purple-300" />}
                </div>

                {/* Bubble */}
                <div className={`p-4 rounded-2xl backdrop-blur-md shadow-lg
          ${isUser
                        ? 'bg-gradient-to-br from-blue-600/80 to-purple-600/80 text-white rounded-tr-sm border border-white/20'
                        : 'bg-white/5 text-gray-100 rounded-tl-sm border border-white/10'
                    }`}>
                    <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {content}
                    </div>
                </div>

            </div>
        </div>
    );
}
