import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MODELS = [
    { id: 'gemini-2.5-flash', label: 'Flash 2.5', icon: Zap, desc: 'Fast & efficient' },
    { id: 'gemini-2.5-pro', label: 'Pro 2.5', icon: Sparkles, desc: 'Deep reasoning' },
    { id: 'gemini-3-flash-preview', label: 'G3 Preview', icon: Sparkles, desc: 'Next-gen frontier model' },
    { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', icon: Zap, desc: 'Powerful Open Source' },
    { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7b', icon: Zap, desc: 'High-speed efficiency' },
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

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 text-gray-400 hover:text-accent-primary transition-all duration-300 rounded-full hover:bg-white/5 hover:scale-110 active:scale-95"
                title="Switch Model"
                aria-label="Switch AI Model"
            >
                <activeModel.icon size={20} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: -8, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={cn(
                            "fixed md:absolute z-[60] bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden transition-all",
                            "bottom-0 left-0 right-0 w-full rounded-t-3xl md:bottom-full md:right-0 md:mb-2 md:w-56 md:rounded-xl"
                        )}
                    >
                        <div className="px-5 py-4 md:p-2 border-b border-glass-border">
                            <h3 className="text-xs md:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Model Choice</h3>
                        </div>
                        <div className="flex flex-col gap-1 p-2 md:p-0">
                            {MODELS.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => {
                                        onModelChange(m.id);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-start gap-3 p-2 rounded-lg transition-all text-left group",
                                        modelId === m.id ? "bg-accent-primary/10 text-accent-primary" : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"
                                    )}
                                    aria-label={`Select model: ${m.label}`}
                                >
                                    <div className={cn(
                                        "p-2 rounded-lg bg-black/20 group-hover:bg-accent-primary group-hover:text-white transition-all",
                                        modelId === m.id && "bg-accent-primary text-white"
                                    )}>
                                        <m.icon size={14} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold flex items-center gap-1">
                                            {m.label}
                                            {modelId === m.id && <Check size={10} />}
                                        </div>
                                        <div className="text-[10px] opacity-50 font-medium leading-tight">{m.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
