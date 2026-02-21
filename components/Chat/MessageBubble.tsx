'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Robot } from '@phosphor-icons/react/dist/csr/Robot';
import { User } from '@phosphor-icons/react/dist/csr/User';
import { Copy } from '@phosphor-icons/react/dist/csr/Copy';
import { Check } from '@phosphor-icons/react/dist/csr/Check';
import { ThumbsUp } from '@phosphor-icons/react/dist/csr/ThumbsUp';
import { ThumbsDown } from '@phosphor-icons/react/dist/csr/ThumbsDown';
import { PencilSimple } from '@phosphor-icons/react/dist/csr/PencilSimple';
import { X } from '@phosphor-icons/react/dist/csr/X';
import { PaperPlaneRight } from '@phosphor-icons/react/dist/csr/PaperPlaneRight';
import { Download } from '@phosphor-icons/react/dist/csr/Download';
import { Terminal } from '@phosphor-icons/react/dist/csr/Terminal';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageBubbleProps {
    message: {
        id: string;
        role: 'user' | 'model' | 'tool';
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
                "flex w-full mb-6 group/message",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div className={cn(
                "flex max-w-[90%] md:max-w-[80%] gap-4",
                isUser ? "flex-row-reverse" : "flex-row"
            )}>
                {/* Avatar */}
                <Avatar className={cn(
                    "h-8 w-8 mt-1 shadow-lg ring-2 ring-white/10",
                    isUser ? "ring-accent" : "ring-white/20"
                )}>
                    <AvatarFallback className={cn(
                        "text-xs font-bold",
                        isUser ? "bg-accent text-white" : "bg-white/10 text-white"
                    )}>
                        {isUser ? <User size={14} weight="fill" /> : <Robot size={16} weight="duotone" />}
                    </AvatarFallback>
                </Avatar>

                {/* Bubble Container */}
                <div className={cn("flex flex-col gap-1 min-w-0 max-w-full", isUser ? "items-end" : "items-start")}>

                    <div className={cn(
                        "p-4 rounded-2xl shadow-md min-w-[60px] relative overflow-hidden",
                        isUser
                            ? "bg-accent text-white rounded-tr-sm"
                            : "glass-panel text-gray-100 rounded-tl-sm border-white/10 bg-white/5",
                        isEditing ? "w-full min-w-[300px]" : ""
                    )}>
                        {/* Shimmer Effect for User */}
                        {isUser && !isEditing && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                        )}

                        <div className="p-4">
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
                                        className="w-full bg-black/20 text-white p-3 rounded-xl outline-none resize-none min-h-[80px] text-sm leading-relaxed"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-8 w-8 p-0">
                                            <X size={14} weight="bold" />
                                        </Button>
                                        <Button size="sm" variant="default" onClick={handleSaveEdit} className="h-8 gap-2 bg-white/10 hover:bg-white/20">
                                            <PaperPlaneRight size={12} weight="fill" /> Save
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className={cn("prose prose-invert prose-sm max-w-none leading-relaxed break-words safe-html")}>
                                    <ReactMarkdown
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
                                                            <div className="flex gap-2 my-2 w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent snap-x">
                                                                {content}
                                                            </div>
                                                        );
                                                    }

                                                    // Single image - use div to avoid p > div nesting issue
                                                    return <div className="mb-2 last:mb-0 w-full">{content}</div>;
                                                }
                                                return <p className="mb-2 last:mb-0">{children}</p>;
                                            },

                                            code({ node, inline, className, children, ...props }: any) {
                                                const match = /language-(\w+)/.exec(className || '');
                                                return !inline && match ? (
                                                    <div className="relative group/code my-4 rounded-lg overflow-hidden border border-white/10 shadow-2xl bg-[#1e1e1e]">
                                                        <div className="flex items-center justify-between px-4 py-1.5 bg-white/5 border-b border-white/5">
                                                            <div className="flex items-center gap-2">
                                                                <Terminal size={12} className="text-muted-foreground" weight="duotone" />
                                                                <span className="text-xs text-muted-foreground font-mono">{match[1]}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => navigator.clipboard.writeText(String(children))}
                                                                className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 transition-colors"
                                                            >
                                                                <Copy size={12} weight="bold" /> Copy
                                                            </button>
                                                        </div>
                                                        <SyntaxHighlighter
                                                            style={vscDarkPlus}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                                                            {...props}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    </div>
                                                ) : (
                                                    <code className={cn("bg-white/10 text-pink-300 px-1.5 py-0.5 rounded-md font-mono text-xs", className)} {...props}>
                                                        {children}
                                                    </code>
                                                )
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

                    {/* Actions Row */}
                    <div
                        className={cn(
                            "flex items-center gap-1 px-1 opacity-0 group-hover/message:opacity-100 transition-opacity duration-200",
                            isUser ? "justify-end" : "justify-start"
                        )}
                    >
                        {!isUser && (
                            <>
                                <ActionBtn icon={ThumbsUp} label="Helpful" />
                                <ActionBtn icon={ThumbsDown} label="Not Helpful" />
                            </>
                        )}
                        {!isEditing && (
                            <ActionBtn
                                icon={isCopied ? Check : Copy}
                                label={isCopied ? "Copied!" : "Copy"}
                                onClick={handleCopy}
                                active={isCopied}
                            />
                        )}
                        {isUser && !isEditing && (
                            <ActionBtn icon={PencilSimple} label="Edit" onClick={() => setIsEditing(true)} />
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
                <X size={16} weight="bold" />
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
                    "relative group block overflow-hidden rounded-xl border border-white/10 bg-black/20 shrink-0 cursor-zoom-in snap-center",
                    isGrid ? "w-[200px] h-[200px]" : "w-full max-w-full h-auto min-h-[200px]"
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
                        isGrid ? "w-full h-full object-cover hover:scale-105" : "w-full h-auto block max-h-[300px] object-contain",
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
                        <X size={24} weight="bold" />
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

const ActionBtn = ({ icon: Icon, label, onClick, active }: any) => (
    <TooltipProvider>
        <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
                <button
                    onClick={onClick}
                    className={cn(
                        "p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-all",
                        active && "text-green-400 hover:text-green-300"
                    )}
                >
                    <Icon size={14} weight="duotone" />
                </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[10px]">{label}</TooltipContent>
        </Tooltip>
    </TooltipProvider>
);
