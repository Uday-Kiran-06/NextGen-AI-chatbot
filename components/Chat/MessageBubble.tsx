'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown, Pencil, X, Send, Download, Terminal } from 'lucide-react';
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
                    isUser ? "ring-accent" : "ring-purple-500/50"
                )}>
                    <AvatarFallback className={cn(
                        "text-xs font-bold",
                        isUser ? "bg-accent text-white" : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                    )}>
                        {isUser ? <User size={14} /> : <Bot size={16} />}
                    </AvatarFallback>
                </Avatar>

                {/* Bubble Container */}
                <div className={cn("flex flex-col gap-1 min-w-0 max-w-full", isUser ? "items-end" : "items-start")}>

                    {/* Role Label */}
                    <span className="text-[10px] text-muted-foreground ml-1 uppercase tracking-wider font-semibold opacity-0 group-hover/message:opacity-100 transition-opacity">
                        {isUser ? "You" : "NextGen AI"}
                    </span>

                    <div className={cn(
                        "relative overflow-hidden transition-all duration-300",
                        isUser
                            ? "rounded-2xl rounded-tr-sm bg-accent text-white shadow-[0_0_15px_-3px_var(--accent)]"
                            : "rounded-2xl rounded-tl-sm bg-[#1a1a1a]/80 backdrop-blur-md border border-white/10 text-gray-100 shadow-xl",
                        isEditing ? "w-full min-w-[300px]" : "min-w-[60px]"
                    )}>

                        {/* Shimmer Effect for User */}
                        {isUser && !isEditing && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]" />
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
                                            <X size={14} />
                                        </Button>
                                        <Button size="sm" variant="default" onClick={handleSaveEdit} className="h-8 gap-2 bg-white/10 hover:bg-white/20">
                                            <Send size={12} /> Save
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className={cn("prose prose-invert prose-sm max-w-none leading-relaxed break-words safe-html")}>
                                    <ReactMarkdown
                                        components={{
                                            code({ node, inline, className, children, ...props }: any) {
                                                const match = /language-(\w+)/.exec(className || '');
                                                return !inline && match ? (
                                                    <div className="relative group/code my-4 rounded-lg overflow-hidden border border-white/10 shadow-2xl bg-[#1e1e1e]">
                                                        <div className="flex items-center justify-between px-4 py-1.5 bg-white/5 border-b border-white/5">
                                                            <div className="flex items-center gap-2">
                                                                <Terminal size={12} className="text-muted-foreground" />
                                                                <span className="text-xs text-muted-foreground font-mono">{match[1]}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => navigator.clipboard.writeText(String(children))}
                                                                className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 transition-colors"
                                                            >
                                                                <Copy size={12} /> Copy
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
                            <ActionBtn icon={Pencil} label="Edit" onClick={() => setIsEditing(true)} />
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
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
                    <Icon size={14} />
                </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[10px]">{label}</TooltipContent>
        </Tooltip>
    </TooltipProvider>
);
