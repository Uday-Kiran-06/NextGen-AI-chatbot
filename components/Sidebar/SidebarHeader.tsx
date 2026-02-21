import React from 'react';
import { Sparkle } from '@phosphor-icons/react/dist/csr/Sparkle';
import { X } from '@phosphor-icons/react/dist/csr/X';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarHeaderProps {
    isCollapsed: boolean;
    onClose?: () => void;
}

export const SidebarHeader = ({ isCollapsed, onClose }: SidebarHeaderProps) => {
    return (
        <div className={cn("flex items-center gap-3 p-4 mb-2", isCollapsed ? "justify-center" : "justify-between")}>
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0 shadow-[0_0_15px_-3px_var(--accent)] ring-1 ring-white/20">
                    <Sparkle size={20} className="text-white drop-shadow-md" weight="fill" />
                </div>
                <AnimatePresence mode='wait'>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="flex flex-col overflow-hidden"
                        >
                            <h1 className="font-bold text-lg tracking-wide text-white whitespace-nowrap glow-text">
                                NextGen
                            </h1>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">AI Assistant</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Close Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="md:hidden text-muted-foreground hover:text-white"
            >
                <X size={20} weight="bold" />
            </Button>
        </div>
    );
};
