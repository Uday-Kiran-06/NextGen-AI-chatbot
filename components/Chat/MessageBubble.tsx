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
                                            // Custom Paragraph to handle Image Galleries
                                            p: ({ children }) => {
                                                // Check if children are mostly images
                                                const childrenArray = React.Children.toArray(children);
                                                const imageChildren = childrenArray.filter(
                                                    (child: any) =>
                                                        React.isValidElement(child) &&
                                                        (child.type === 'img' || (child.type as any)?.name === 'ImageAttachment')
                                                );

                                                const hasImages = imageChildren.length > 0;

                                                if (hasImages) {
                                                    // Use 'single' variant if exactly one image, else 'grid'
                                                    const variant = imageChildren.length === 1 ? 'single' : 'grid';

                                                    // Remap children to inject variant prop
                                                    const content = childrenArray.map((child: any) => {
                                                        if (React.isValidElement(child) && (child.type === 'img' || (child.type as any)?.name === 'ImageAttachment')) {
                                                            return React.cloneElement(child, { variant } as any);
                                                        }
                                                        return child;
                                                    });

                                                    if (variant === 'grid') {
                                                        return (
                                                            <div className="flex flex-wrap gap-2 my-2 w-full justify-start">
                                                                {content}
                                                            </div>
                                                        );
                                                    }

                                                    // Single image
                                                    return <p className="mb-2 last:mb-0 w-full">{content}</p>;
                                                }
                                                return <p className="mb-2 last:mb-0">{children}</p>;
                                            },

                                            img: ({ node, ...props }) => {
                                                return <ImageAttachment src={(props.src as string) || ''} alt={(props.alt as string) || ''} />;
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
            </div >
        </motion.div >
    );
}

function ImageAttachment({ src, alt, variant = 'single' }: { src: string, alt: string, variant?: 'single' | 'grid' }) {
    const [error, setError] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!src) return;

        try {
            setIsDownloading(true);
            const response = await fetch(src);
            const blob = await response.blob() as Blob;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `image-${Date.now()}.jpg`;
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
            <span className="p-4 rounded-xl border border-white/10 bg-white/5 text-gray-400 text-sm flex items-center gap-2 w-full h-full min-h-[100px] justify-center">
                <X size={16} />
                <span>Failed to load image</span>
            </span>
        );
    }

    const isGrid = variant === 'grid';

    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    return (
        <>
            <span
                onClick={() => setIsLightboxOpen(true)}
                className={cn(
                    "relative group block overflow-hidden rounded-xl border border-white/10 bg-black/20 shrink-0 cursor-zoom-in",
                    isGrid ? "w-[260px] h-[260px]" : "w-full max-w-full h-auto min-h-[200px]"
                )}
            >
                {isLoading && (
                    <span className="absolute inset-0 flex items-center justify-center bg-white/5 min-h-[200px]">
                        <span className="w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
                    </span>
                )}
                <img
                    src={src}
                    alt={alt}
                    className={cn(
                        "transition-opacity duration-300 transition-transform",
                        isGrid ? "w-full h-full object-cover hover:scale-105" : "w-full h-auto block max-h-[300px] object-contain", // Changed max-h-[500px] to max-h-[300px]
                        isLoading ? "opacity-0" : "opacity-100"
                    )}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setError(true);
                    }}
                />
                {!isLoading && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                        {/* Visual hint only, click handles open */}
                        <div className="bg-black/60 text-white rounded-full p-2 backdrop-blur-sm">
                            <Download size={18} />
                        </div>
                    </div>
                )}
            </span>

            {/* Lightbox Portal */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[101]"
                    >
                        <X size={24} />
                    </button>

                    <button
                        onClick={handleDownload}
                        className="absolute bottom-8 right-8 flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-accent-primary/80 text-white rounded-full transition-colors z-[101]"
                    >
                        {isDownloading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Download size={18} />
                        )}
                        <span>Download</span>
                    </button>

                    <img
                        src={src}
                        alt={alt}
                        className="max-w-full max-h-full object-contain shadow-2xl rounded-sm pointer-events-auto"
                        onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
                    />
                </div>
            )}
        </>
    );
}
