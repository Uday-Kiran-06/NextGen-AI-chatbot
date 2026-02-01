'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown, Pencil, X, Send, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { useState, useRef, useEffect } from 'react';

interface MessageBubbleProps {
    message: {
        id: string;
        role: 'user' | 'model';
        content: string;
    };
    isLast?: boolean;
    onEdit?: (id: string, newContent: string) => void;
}

export default function MessageBubble({ message, isLast, onEdit }: MessageBubbleProps) {
    const isUser = message.role === 'user';
    const [isCopied, setIsCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [isEditing]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleSaveEdit = () => {
        if (onEdit && editContent.trim() !== "") {
            onEdit(message.id, editContent);
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        setEditContent(message.content);
        setIsEditing(false);
    };

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

                {/* Bubble Container */}
                <div className={cn("flex flex-col gap-1 min-w-0", isUser ? "items-end" : "items-start")}>
                    <div className={cn("flex items-end gap-2 group/bubble", isUser ? "flex-row-reverse" : "flex-row")}>



                        <div className={cn(
                            "p-4 rounded-2xl shadow-md min-w-[60px] relative overflow-hidden",
                            isUser
                                ? "bg-accent-primary text-white rounded-tr-sm"
                                : "glass-panel text-gray-100 rounded-tl-sm border-white/10 bg-white/5",
                            isEditing ? "w-full min-w-[300px]" : ""
                        )}>
                            {/* Shimmer Effect for User */}
                            {isUser && !isEditing && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                            )}

                            {isEditing ? (
                                <div className="flex flex-col gap-2 w-full">
                                    <textarea
                                        ref={textareaRef}
                                        value={editContent}
                                        onChange={(e) => {
                                            setEditContent(e.target.value);
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                        }}
                                        className="w-full bg-black/20 text-white p-2 rounded-md outline-none resize-none min-h-[60px]"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={handleCancelEdit} className="p-1 hover:bg-white/10 rounded text-gray-300 hover:text-white">
                                            <X size={16} />
                                        </button>
                                        <button onClick={handleSaveEdit} className="p-1 hover:bg-green-500/20 rounded text-green-400 hover:text-green-300">
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="prose prose-invert prose-sm max-w-none leading-relaxed break-words">
                                    <ReactMarkdown
                                        urlTransform={(value) => value}
                                        components={{
                                            img: ({ node, ...props }) => {
                                                if (!props.src) return null;
                                                const [error, setError] = useState(false);
                                                const [isDownloading, setIsDownloading] = useState(false);
                                                const [isLoading, setIsLoading] = useState(true);

                                                const handleDownload = async (e: React.MouseEvent) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    if (!props.src) return;

                                                    try {
                                                        setIsDownloading(true);
                                                        const response = await fetch(String(props.src));
                                                        const blob = await response.blob();
                                                        const url = window.URL.createObjectURL(blob);
                                                        const a = document.createElement('a');
                                                        a.href = url;
                                                        a.download = `generated-image-${Date.now()}.jpg`;
                                                        document.body.appendChild(a);
                                                        a.click();
                                                        window.URL.revokeObjectURL(url);
                                                        document.body.removeChild(a);
                                                    } catch (err) {
                                                        console.error("Failed to download image:", err);
                                                    } finally {
                                                        setIsDownloading(false);
                                                    }
                                                };

                                                if (error) {
                                                    return (
                                                        <span className="p-4 rounded-xl border border-white/10 bg-white/5 text-gray-400 text-sm flex items-center gap-2 w-full">
                                                            <X size={16} />
                                                            <span>Failed to load image. content may have expired.</span>
                                                        </span>
                                                    );
                                                }

                                                return (
                                                    <span className="relative group inline-block max-w-full min-h-[100px] min-w-[200px]">
                                                        {isLoading && (
                                                            <span className="absolute inset-0 flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
                                                                <span className="flex flex-col items-center gap-2">
                                                                    <span className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                                                                    <span className="text-xs text-gray-400">Generating...</span>
                                                                </span>
                                                            </span>
                                                        )}
                                                        <img
                                                            {...props}
                                                            className={cn(
                                                                "rounded-xl max-w-full !max-h-[300px] w-auto my-2 border border-white/10 object-contain block transition-opacity duration-300",
                                                                isLoading ? "opacity-0" : "opacity-100"
                                                            )}
                                                            style={{ maxHeight: '300px', width: 'auto' }}
                                                            onLoad={() => setIsLoading(false)}
                                                            onError={() => {
                                                                setIsLoading(false);
                                                                setError(true);
                                                            }}
                                                        />
                                                        {!isLoading && (
                                                            <button
                                                                onClick={handleDownload}
                                                                disabled={isDownloading}
                                                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                                                title="Download Image"
                                                            >
                                                                {isDownloading ? (
                                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                                ) : (
                                                                    <Download size={16} />
                                                                )}
                                                            </button>
                                                        )}
                                                    </span>
                                                );
                                            }
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions (Model and User) */}
                    <div
                        className={cn(
                            "flex items-center gap-2 mt-1 px-1 select-none",
                            isUser ? "justify-end" : "justify-start"
                        )}
                    >
                        {!isUser && (
                            <>
                                <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors" title="Helpful">
                                    <ThumbsUp size={14} />
                                </button>
                                <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors" title="Not Helpful">
                                    <ThumbsDown size={14} />
                                </button>
                            </>
                        )}

                        {/* Copy Button (Both) */}
                        {!isEditing && (
                            <button
                                onClick={handleCopy}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors"
                                title="Copy"
                            >
                                {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                            </button>
                        )}

                        {/* Edit Button (User Only) */}
                        {isUser && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors"
                                title="Edit"
                            >
                                <Pencil size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
