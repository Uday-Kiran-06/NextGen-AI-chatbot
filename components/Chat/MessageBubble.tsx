'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Copy, ThumbsUp, ThumbsDown, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
    message: {
        id: string;
        role: 'user' | 'model';
        content: string;
    };
    isLast?: boolean;
}

export default function MessageBubble({ message, isLast }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
            className={cn(
                "flex w-full mb-6",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div className={cn(
                "flex max-w-[85%] md:max-w-[75%] gap-4 group",
                isUser ? "flex-row-reverse" : "flex-row"
            )}>
                {/* Avatar */}
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg mt-1",
                    isUser ? "bg-accent-primary text-white" : "bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
                )}>
                    {isUser ? <User size={16} /> : <Bot size={18} />}
                </div>

                {/* Bubble */}
                <div className="flex flex-col gap-1 min-w-0">
                    <div className={cn(
                        "p-4 rounded-2xl shadow-md min-w-[60px] relative overflow-hidden",
                        isUser
                            ? "bg-accent-primary text-white rounded-tr-sm"
                            : "glass-panel text-gray-100 rounded-tl-sm border-white/10 bg-white/5"
                    )}>
                        {/* Shimmer Effect for User */}
                        {isUser && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                        )}

                        <div className="prose prose-invert prose-sm max-w-none leading-relaxed break-words">
                            <ReactMarkdown
                                urlTransform={(value) => value}
                                components={{
                                    img: ({ node, ...props }) => {
                                        if (!props.src) return null;
                                        return <img {...props} className="rounded-xl max-w-full my-2 border border-white/10" />;
                                    }
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* Actions (Only for Model) */}
                    {!isUser && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-2 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Copy">
                                <Copy size={14} />
                            </button>
                            <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Helpful">
                                <ThumbsUp size={14} />
                            </button>
                            <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Not Helpful">
                                <ThumbsDown size={14} />
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
