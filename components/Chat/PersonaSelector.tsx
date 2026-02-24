import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Image as ImageIcon, PenTool, Mic, ChevronDown, Check } from 'lucide-react';
import { cn, vibrate } from '@/lib/utils';

export const PERSONAS = [
    { id: 'Standard AI', label: 'Standard', icon: Sparkles, desc: 'Balanced and helpful' },
    { id: "You are a senior software engineer called 'CodeMaster'.", label: 'Coder', icon: Zap, desc: 'Technical and precise' },
    { id: 'You are a creative copywriter.', label: 'Creative', icon: ImageIcon, desc: 'Inspiring and expressive' },
    { id: 'You are a data analyst.', label: 'Analyst', icon: PenTool, desc: 'Logical and insightful' },
    { id: "You are a sarcastic, witty, and slightly cynical AI assistant. You use dark humor and irony frequently.", label: 'Sarcastic', icon: Mic, desc: 'Witty and cynical' },
];

interface PersonaSelectorProps {
    persona: string;
    onPersonaChange: (persona: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export default function PersonaSelector({ persona, onPersonaChange, isOpen, setIsOpen, dropdownRef }: PersonaSelectorProps) {
    const activePersona = PERSONAS.find(p => p.id === persona) || PERSONAS[0];

    return (
        <div className="relative shrink-0 flex items-center h-[40px] md:h-[44px]" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-2 sm:px-3 py-1.5 md:py-2 flex items-center gap-1 sm:gap-2 bg-transparent text-[11px] sm:text-xs font-bold text-gray-500 hover:text-accent-primary hover:bg-white/5 rounded-xl transition-all h-full"
            >
                <activePersona.icon size={16} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden xs:block">{activePersona.label}</span>
                <ChevronDown size={14} className={cn("transition-transform duration-300 sm:w-3 sm:h-3", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: -8, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={cn(
                            "fixed md:absolute z-[60] bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden transition-all",
                            "bottom-0 left-0 right-0 w-full rounded-t-3xl md:bottom-full md:left-0 md:mb-2 md:w-40 md:rounded-xl"
                        )}
                    >
                        <div className="px-5 py-4 md:p-1.5 border-b border-glass-border">
                            <h3 className="text-xs md:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">AI Persona</h3>
                        </div>
                        <div className="flex flex-col gap-0.5 p-2 md:p-0">
                            {PERSONAS.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        onPersonaChange(p.id);
                                        setIsOpen(false);
                                        vibrate(5);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-left group",
                                        persona === p.id ? "bg-accent-primary/10 text-accent-primary" : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"
                                    )}
                                >
                                    <p.icon size={14} className={persona === p.id ? "opacity-100" : "opacity-50 group-hover:opacity-100"} />
                                    <span className="text-xs font-medium flex-1">{p.label}</span>
                                    {persona === p.id && <Check size={12} />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
