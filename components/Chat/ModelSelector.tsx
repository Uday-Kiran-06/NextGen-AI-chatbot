'use client';

import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Cpu, Check, Zap, Atom, Server, Bot, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MODELS = [
    { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', shortLabel: 'Gemini 2.5', icon: Zap, desc: 'Fast & efficient' },
    { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', shortLabel: 'Gemini Pro', icon: Brain, desc: 'Deep reasoning' },
    { id: 'gemini-3-flash-preview', label: 'Gemini 3 Preview', shortLabel: 'Gemini 3', icon: Atom, desc: 'Next-gen frontier' },
    { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', shortLabel: 'Llama 3.3', icon: Server, desc: 'Open source' },
    { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7b', shortLabel: 'Mixtral', icon: Cpu, desc: 'High efficiency' },
    { id: 'ollama-llama3', label: 'Local (Ollama)', shortLabel: 'Ollama', icon: Bot, desc: 'Private & local' },
];

interface ModelSelectorProps {
    modelId: string;
    onModelChange: (modelId: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export default function ModelSelector({ modelId, onModelChange, isOpen, setIsOpen, dropdownRef }: ModelSelectorProps) {
    const activeModel = MODELS.find(m => m.id === modelId) || MODELS[0];
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.top - 340,
                left: Math.min(rect.left, window.innerWidth - 296)
            });
        }
    }, [isOpen]);

    const dropdownContent = isOpen && (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9998]"
                onClick={() => setIsOpen(false)}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="fixed w-72 rounded-2xl overflow-hidden z-[9999] shadow-2xl"
                style={{
                    backgroundColor: 'var(--sidebar-bg)',
                    border: '1px solid var(--sidebar-border)',
                    top: `${Math.max(16, position.top)}px`,
                    left: `${Math.max(16, position.left)}px`
                }}
            >
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
                    <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--foreground)', opacity: 0.6 }}>Select AI Model</h3>
                </div>
                <div className="flex flex-col p-1.5 max-h-80 overflow-y-auto">
                    {MODELS.map((m, i) => (
                        <motion.button
                            key={m.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            onClick={() => { onModelChange(m.id); setIsOpen(false); }}
                            className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                                modelId === m.id ? "bg-[var(--accent-glow)]" : "hover:bg-[var(--sidebar-hover)]"
                            )}
                        >
                            <div 
                                className="p-2 rounded-lg"
                                style={{
                                    backgroundColor: modelId === m.id ? 'var(--accent-primary)' : 'var(--sidebar-hover)',
                                    color: modelId === m.id ? 'white' : 'var(--foreground)'
                                }}
                            >
                                <m.icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                                    {m.label}
                                    {modelId === m.id && <Check size={14} style={{ color: 'var(--accent-primary)' }} />}
                                </div>
                                <div className="text-xs" style={{ color: 'var(--foreground)', opacity: 0.5 }}>{m.desc}</div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </>
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <motion.button
                ref={buttonRef}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                style={{
                    backgroundColor: isOpen ? 'var(--accent-glow)' : 'transparent',
                    border: '1px solid',
                    borderColor: isOpen ? 'var(--accent-primary)' : 'transparent',
                    color: 'var(--foreground)'
                }}
                title="Switch Model"
            >
                <activeModel.icon size={14} style={{ color: 'var(--accent-primary)' }} />
                <span className="text-xs font-medium">{activeModel.shortLabel}</span>
                <ChevronDown 
                    size={12} 
                    className={cn("transition-transform", isOpen && "rotate-180")} 
                    style={{ opacity: 0.5 }}
                />
            </motion.button>

            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>{dropdownContent}</AnimatePresence>,
                document.body
            )}
        </div>
    );
}
