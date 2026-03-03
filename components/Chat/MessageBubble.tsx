'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown, Pencil, X, Send, Download, Volume2, RefreshCw, Sparkles } from 'lucide-react';
import { cn, vibrate } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import CodeBlock from './CodeBlock';
import ImageAttachment from './ImageAttachment';

interface MessageBubbleProps {
    message: {
        id: string;
        role: 'user' | 'model';
        content: string;
    };
    isLast?: boolean;
    isGenerating?: boolean;
    onEdit?: (id: string, newContent: string) => void;
    onRegenerate?: () => void;
    onOpenArtifact?: (code: string, lang: string) => void;
}

const MessageBubble = React.memo(({ message, isLast, isGenerating, onEdit, onRegenerate, onOpenArtifact }: MessageBubbleProps) => {
    const isUser = message.role === 'user';
    const [isCopied, setIsCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message.content);
    const [isPlaying, setIsPlaying] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [isEditing]);

    const onOpenArtifactRef = useRef(onOpenArtifact);
    useEffect(() => {
        onOpenArtifactRef.current = onOpenArtifact;
    }, [onOpenArtifact]);

    const markdownComponents = React.useMemo(() => ({
        code: (props: any) => <CodeBlock {...props} onOpenArtifact={(code: string, lang: string) => onOpenArtifactRef.current?.(code, lang)} />,
        p: ({ node, children }: any) => {
            const childrenArray = React.Children.toArray(children);
            const imageChildren = childrenArray.filter(
                (child: any) =>
                    React.isValidElement(child) &&
                    (child as any).props?.node?.tagName === 'img'
            );

            const hasImages = imageChildren.length > 0;

            if (hasImages) {
                const variant = imageChildren.length === 1 ? 'single' : 'grid';

                const content = childrenArray.map((child: any) => {
                    if (React.isValidElement(child) && (child as any).props?.node?.tagName === 'img') {
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

                return <div className="mb-2 last:mb-0 w-full">{content}</div>;
            }
            return <div className="mb-4 last:mb-0 leading-7">{children}</div>;
        },
        img: ({ node, ...props }: any) => {
            return <ImageAttachment src={props.src || ''} alt={props.alt || ''} variant={props.variant || 'single'} />;
        }
    }), []);

    useEffect(() => {
        return () => {
            if (isPlaying) window.speechSynthesis.cancel();
        };
    }, [isPlaying]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setIsCopied(true);
        vibrate(10);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleReadAloud = () => {
        if (!window.speechSynthesis) return;

        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(message.content);
        utterance.onend = () => setIsPlaying(false);
        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
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
            layout="position"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
            }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 60) {
                    handleCopy();
                }
            }}
            className={cn(
                "flex w-full mb-8 relative touch-pan-y transform-gpu backface-hidden",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div className={cn(
                "flex max-w-[85%] md:max-w-[85%] gap-4 group w-full",
                isUser ? "flex-row-reverse" : "flex-row"
            )}>
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg mt-1",
                    isUser ? "bg-accent-primary text-white" : "bg-transparent text-accent-secondary"
                )}>
                    {isUser ? <User size={16} /> : <Sparkles size={20} />}
                </div>

                {/* Bubble Container */}
                <div className={cn("flex flex-col gap-1 min-w-0 flex-1 md:flex-initial", isUser ? "items-end" : "items-start")}>
                    <div className={cn("flex items-end gap-2 group/bubble w-full", isUser ? "flex-row-reverse" : "flex-row")}>

                        <div className={cn(
                            "relative overflow-hidden w-full",
                            isUser
                                ? "p-4 rounded-2xl shadow-md bg-accent-primary text-white rounded-tr-sm min-w-[60px]"
                                : "py-2 text-foreground", // Removed bubble styling for AI
                            isEditing ? "w-full min-w-[300px]" : ""
                        )}>
                            {/* Shimmer Effect for User */}
                            {isUser && !isEditing && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_5s_infinite] pointer-events-none" />
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
                                        className="w-full bg-black/5 dark:bg-black/20 text-foreground p-2 rounded-md outline-none resize-none min-h-[60px]"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={handleCancelEdit} className="p-1.5 hover:bg-glass-shimmer rounded-lg text-gray-500 dark:text-gray-300 hover:text-foreground hover:scale-110 active:scale-95 transition-all">
                                            <X size={16} />
                                        </button>
                                        <button onClick={handleSaveEdit} className="p-1.5 hover:bg-green-500/10 rounded-lg text-green-600 dark:text-green-400 hover:scale-110 active:scale-95 transition-all shadow-sm">
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="prose prose-sm md:prose-[15px] max-w-none break-words 
                                    text-foreground/90 prose-zinc dark:prose-invert
                                    prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0
                                    prose-code:before:content-none prose-code:after:content-none
                                    prose-a:text-accent-primary hover:prose-a:text-accent-secondary
                                ">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm, remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                        urlTransform={(value) => value}
                                        components={markdownComponents}
                                    >
                                        {message.content + (isGenerating ? ' █' : '')}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        className={cn(
                            "flex items-center gap-1 md:gap-2 mt-1 px-1 select-none transition-opacity duration-300",
                            "opacity-50 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100", // Faintly visible on touch, reveal fully on hover
                            isUser ? "justify-end" : "justify-start"
                        )}
                    >
                        {!isUser && (
                            <>
                                <button onClick={handleReadAloud} className={cn("p-2 mb-1 md:p-1.5 md:mb-0 hover:bg-glass-shimmer rounded-lg hover:scale-110 active:scale-95 transition-all duration-200", isPlaying ? "text-accent-primary opacity-100" : "text-gray-500 dark:text-gray-300 hover:text-accent-primary hover:opacity-100")} title="Read Aloud" aria-label="Read message aloud">
                                    <Volume2 size={16} className="md:w-3.5 md:h-3.5" />
                                </button>
                                {isLast && onRegenerate && (
                                    <button onClick={onRegenerate} className="p-2 mb-1 md:p-1.5 md:mb-0 hover:bg-glass-shimmer rounded-lg text-gray-500 dark:text-gray-300 hover:text-accent-primary hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200" title="Regenerate" aria-label="Regenerate message">
                                        <RefreshCw size={16} className="md:w-3.5 md:h-3.5" />
                                    </button>
                                )}
                                <button className="p-2 mb-1 md:p-1.5 md:mb-0 hover:bg-glass-shimmer rounded-lg text-gray-500 dark:text-gray-300 hover:text-accent-primary hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200" title="Helpful" aria-label="Rate message as helpful">
                                    <ThumbsUp size={16} className="md:w-3.5 md:h-3.5" />
                                </button>
                                <button className="p-2 mb-1 md:p-1.5 md:mb-0 hover:bg-glass-shimmer rounded-lg text-gray-500 dark:text-gray-300 hover:text-accent-primary hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200" title="Not Helpful" aria-label="Rate message as not helpful">
                                    <ThumbsDown size={16} className="md:w-3.5 md:h-3.5" />
                                </button>
                            </>
                        )}

                        {/* Copy Button (Both) */}
                        {!isEditing && (
                            <button
                                onClick={handleCopy}
                                className="p-2 mb-1 md:p-1.5 md:mb-0 hover:bg-glass-shimmer rounded-lg text-gray-500 dark:text-gray-300 hover:text-accent-primary hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200"
                                title="Copy"
                                aria-label="Copy message text"
                            >
                                {isCopied ? <Check size={16} className="text-green-500 md:w-3.5 md:h-3.5" /> : <Copy size={16} className="md:w-3.5 md:h-3.5" />}
                            </button>
                        )}

                        {/* Edit Button (User Only) */}
                        {isUser && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 mb-1 md:p-1.5 md:mb-0 hover:bg-glass-shimmer rounded-lg text-gray-500 dark:text-gray-300 hover:text-accent-primary hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200"
                                title="Edit"
                                aria-label="Edit your message"
                            >
                                <Pencil size={16} className="md:w-3.5 md:h-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div >
    );
});

export const MessageSkeleton = () => (
    <div className="flex w-full mb-8 justify-start">
        <div className="flex max-w-[85%] gap-4 w-full flex-row">
            <div className="w-8 h-8 rounded-full bg-white/5 animate-skeleton shrink-0 mt-1" />
            <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 bg-white/5 rounded-lg w-3/4 animate-skeleton" />
                <div className="h-4 bg-white/5 rounded-lg w-1/2 animate-skeleton" />
                <div className="h-4 bg-white/5 rounded-lg w-2/3 animate-skeleton" />
            </div>
        </div>
    </div>
);

export default MessageBubble;
