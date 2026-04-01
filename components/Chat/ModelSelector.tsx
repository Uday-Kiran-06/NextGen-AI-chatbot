import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Cpu, Check, Zap, Atom, Server, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MODELS = [
    { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', icon: Zap, desc: 'Fast & efficient' },
    { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', icon: Brain, desc: 'Deep reasoning' },
    { id: 'gemini-3-flash-preview', label: 'Gemini 3 Preview', icon: Atom, desc: 'Next-gen frontier' },
    { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', icon: Server, desc: 'Open source' },
    { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7b', icon: Cpu, desc: 'High efficiency' },
    { id: 'ollama-llama3', label: 'Local (Ollama)', icon: Bot, desc: 'Private & local' },
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
                className="px-3 py-2 text-gray-400 hover:text-accent-primary transition-all duration-300 rounded-xl hover:bg-white/5 hover:scale-105 active:scale-95 flex items-center gap-2"
                title="Switch Model"
                aria-label="Switch AI Model"
            >
                <activeModel.icon size={18} className="text-violet-500" />
                <span className="hidden md:block text-xs font-semibold tracking-wide whitespace-nowrap">{activeModel.label.split(' ')[0]}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: -8, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={cn(
                            "fixed md:absolute z-[60] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden transition-all",
                            "bottom-0 left-0 right-0 w-full rounded-t-3xl md:bottom-full md:right-0 md:mb-2 md:w-56 md:rounded-xl"
                        )}
                    >
                        <div className="px-5 py-4 md:p-2 border-b border-black/5 dark:border-white/5">
                            <div className="flex items-center gap-2">
                                <Atom className="w-3.5 h-3.5 text-violet-500" />
                                <h3 className="text-xs md:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Select Model</h3>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 p-2 md:p-0 max-h-80 overflow-y-auto">
                            {MODELS.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => {
                                        onModelChange(m.id);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-start gap-3 p-2 rounded-lg transition-all text-left group",
                                        modelId === m.id ? "bg-violet-500/10 text-violet-600 dark:text-violet-400" : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"
                                    )}
                                    aria-label={`Select model: ${m.label}`}
                                >
                                    <div className={cn(
                                        "p-2 rounded-lg transition-all",
                                        modelId === m.id 
                                            ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20" 
                                            : "bg-black/10 dark:bg-white/10 group-hover:bg-violet-500 group-hover:text-white"
                                    )}>
                                        <m.icon size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold flex items-center gap-1.5">
                                            {m.label}
                                            {modelId === m.id && <Check size={12} className="text-violet-500" />}
                                        </div>
                                        <div className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">{m.desc}</div>
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
