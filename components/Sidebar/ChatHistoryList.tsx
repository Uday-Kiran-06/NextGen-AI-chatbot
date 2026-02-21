import React, { useState } from 'react';
import { ClockCounterClockwise } from '@phosphor-icons/react/dist/csr/ClockCounterClockwise';
import { DotsThreeVertical } from '@phosphor-icons/react/dist/csr/DotsThreeVertical';
import { ShareNetwork } from '@phosphor-icons/react/dist/csr/ShareNetwork';
import { PencilSimple } from '@phosphor-icons/react/dist/csr/PencilSimple';
import { PushPin } from '@phosphor-icons/react/dist/csr/PushPin';
import { Archive } from '@phosphor-icons/react/dist/csr/Archive';
import { Trash } from '@phosphor-icons/react/dist/csr/Trash';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Conversation, chatStore } from '@/lib/chat-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/custom-dropdown"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface ChatListProps {
    conversations: Conversation[];
    activeId: string | null;
    isCollapsed: boolean;
    searchTerm: string;
    loading: boolean;
    onSelectChat: (id: string) => void;
    onNewChat: () => void;
    onCloseMobile?: () => void;
    refreshChats: () => void;
}

export const ChatList = ({
    conversations,
    activeId,
    isCollapsed,
    searchTerm,
    loading,
    onSelectChat,
    onNewChat,
    onCloseMobile,
    refreshChats
}: ChatListProps) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    const handleAction = async (action: string, conversation: Conversation) => {
        switch (action) {
            case 'rename':
                setEditingId(conversation.id);
                setEditTitle(conversation.title);
                break;
            case 'pin':
                await chatStore.togglePin(conversation.id, !conversation.is_pinned);
                refreshChats();
                break;
            case 'archive':
                // We'll replace this confirm with a proper toast undo action later
                if (confirm('Archive this chat?')) {
                    await chatStore.toggleArchive(conversation.id, true);
                    refreshChats();
                    if (activeId === conversation.id) onNewChat();
                }
                break;
            case 'delete':
                if (confirm('Delete this conversation permanently?')) {
                    await chatStore.deleteConversation(conversation.id);
                    refreshChats();
                    if (activeId === conversation.id) onNewChat();
                }
                break;
            case 'share':
                const messages = await chatStore.getMessages(conversation.id);
                const text = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
                navigator.clipboard.writeText(text);
                break;
        }
    };

    const handleRenameSubmit = async (e: React.FormEvent | React.FocusEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (editTitle.trim() && editTitle !== conversations.find(c => c.id === id)?.title) {
            await chatStore.renameConversation(id, editTitle);
            refreshChats();
        }
        setEditingId(null);
    };

    const filteredHistory = conversations.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-hide py-2">
            {!isCollapsed && (
                <div className="px-2 mb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pl-2">
                        History
                    </span>
                </div>
            )}

            {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                    <div key={item.id} className="relative group/item">
                        {editingId === item.id ? (
                            <form
                                onSubmit={(e) => handleRenameSubmit(e, item.id)}
                                className="p-1"
                            >
                                <Input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onBlur={(e) => handleRenameSubmit(e, item.id)}
                                    // eslint-disable-next-line jsx-a11y/no-autofocus
                                    autoFocus
                                    className="h-8 text-sm"
                                />
                            </form>
                        ) : (
                            <div className="flex items-center gap-1 group/button-wrapper">
                                <TooltipProvider>
                                    <Tooltip delayDuration={500}>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    onSelectChat(item.id);
                                                    if (window.innerWidth < 768) onCloseMobile?.();
                                                }}
                                                className={cn(
                                                    "w-full justify-start gap-3 h-10 font-normal relative overflow-hidden transition-all",
                                                    activeId === item.id 
                                                        ? "bg-primary text-white shadow-md hover:bg-primary/90" 
                                                        : "bg-white/5 text-gray-300 hover:bg-white/15 hover:text-white",
                                                    isCollapsed && "justify-center px-0"
                                                )}
                                            >
                                                {item.is_pinned ? (
                                                    <PushPin size={14} className="shrink-0 text-accent rotate-45" weight="fill" />
                                                ) : (
                                                    <ClockCounterClockwise size={16} className="shrink-0 text-muted-foreground" weight="duotone" />
                                                )}

                                                {!isCollapsed && (
                                                    <span className="truncate flex-1 text-left">
                                                        {item.title}
                                                    </span>
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
                                    </Tooltip>
                                </TooltipProvider>

                                {!isCollapsed && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity focus:opacity-100"
                                            >
                                                <DotsThreeVertical size={14} weight="bold" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem onClick={() => handleAction('share', item)}>
                                                <ShareNetwork className="mr-2 h-4 w-4" weight="bold" /> Share
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAction('rename', item)}>
                                                <PencilSimple className="mr-2 h-4 w-4" weight="bold" /> Rename
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleAction('pin', item)}>
                                                <PushPin className="mr-2 h-4 w-4" weight="bold" /> {item.is_pinned ? "Unpin" : "Pin"}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleAction('archive', item)}>
                                                <Archive className="mr-2 h-4 w-4" weight="bold" /> Archive
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleAction('delete', item)}
                                                className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                                            >
                                                <Trash className="mr-2 h-4 w-4" weight="bold" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                !isCollapsed && (
                    <div className="px-4 py-8 text-center text-muted-foreground">
                        <p className="text-sm">{loading ? 'Loading...' : 'No conversations yet'}</p>
                    </div>
                )
            )}
        </div>
    );
};
