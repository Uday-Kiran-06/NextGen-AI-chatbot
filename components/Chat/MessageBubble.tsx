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
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1",
                    isUser ? "bg-primary-container text-on-primary-container" : "bg-secondary-container text-on-secondary-container"
                )}>
                    {isUser ? <User size={16} /> : <Bot size={18} />}
                </div>

                {/* Bubble */}
                <div className="flex flex-col gap-1 min-w-0">
                    <div className={cn(
                        "p-4 shadow-sm min-w-[60px] relative overflow-hidden",
                        isUser
                            ? "bg-primary text-on-primary rounded-[24px] rounded-tr-sm"
                            : "bg-surface-container-high text-on-surface rounded-[24px] rounded-tl-sm"
                    )}>
                        <div className="prose prose-invert prose-sm max-w-none leading-relaxed break-words">
                            <ReactMarkdown
                                urlTransform={(value) => value}
                                components={{
                                    img: ({ node, ...props }) => {
                                        if (!props.src) return null;
                                        return <img {...props} className="rounded-xl max-w-full my-2 border border-outline-variant" />;
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
                            <button className="p-1.5 hover:bg-surface-container-highest rounded-full text-on-surface-variant hover:text-on-surface transition-colors" title="Copy">
                                <Copy size={16} />
                            </button>
                            <button className="p-1.5 hover:bg-surface-container-highest rounded-full text-on-surface-variant hover:text-on-surface transition-colors" title="Helpful">
                                <ThumbsUp size={16} />
                            </button>
                            <button className="p-1.5 hover:bg-surface-container-highest rounded-full text-on-surface-variant hover:text-on-surface transition-colors" title="Not Helpful">
                                <ThumbsDown size={16} />
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
