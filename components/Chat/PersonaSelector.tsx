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

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [customPrompt, setCustomPrompt] = React.useState('');

    const handleOpenCustom = () => {
        setCustomPrompt(localStorage.getItem('nextgen_custom_persona') || '');
        setIsModalOpen(true);
        setIsOpen(false);
    };

    const handleSaveCustom = () => {
        if (customPrompt.trim()) {
            localStorage.setItem('nextgen_custom_persona', customPrompt.trim());
            onPersonaChange(customPrompt.trim());
        } else {
            onPersonaChange('Standard AI');
        }
        setIsModalOpen(false);
        vibrate(5);
    };

    const isCustomActive = persona !== 'Standard AI' && !PERSONAS.some(p => p.id === persona);

    return (
        <>
            <div className="relative shrink-0 flex items-center h-[40px] md:h-[44px]" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-2 sm:px-3 py-1.5 md:py-2 flex items-center gap-1 sm:gap-2 bg-transparent text-[11px] sm:text-xs font-bold text-gray-500 hover:text-accent-primary hover:bg-white/5 rounded-xl transition-all h-full"
                >
                    {isCustomActive ? <PenTool size={16} className="sm:w-3.5 sm:h-3.5" /> : <activePersona.icon size={16} className="sm:w-3.5 sm:h-3.5" />}
                    <span className="hidden xs:block">{isCustomActive ? 'Custom' : activePersona.label}</span>
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
                                "bottom-0 left-0 right-0 w-full rounded-t-3xl md:bottom-full md:left-0 md:mb-2 md:w-48 md:rounded-xl"
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
                                <div className="h-px bg-glass-border my-1" />
                                <button
                                    onClick={handleOpenCustom}
                                    className={cn(
                                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-left group",
                                        isCustomActive ? "bg-accent-primary/10 text-accent-primary" : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5"
                                    )}
                                >
                                    <PenTool size={14} className={isCustomActive ? "opacity-100" : "opacity-50 group-hover:opacity-100"} />
                                    <span className="text-xs font-medium flex-1">Custom...</span>
                                    {isCustomActive && <Check size={12} />}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-[101] overflow-hidden"
                        >
                            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
                                <h3 className="font-semibold text-white">Custom System Instructions</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors p-1">
                                    <ChevronDown size={20} className="rotate-90" />
                                </button>
                            </div>
                            <div className="p-4 space-y-4">
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Define exactly how the AI should behave globally. This will override default personas.
                                </p>
                                <textarea
                                    value={customPrompt}
                                    onChange={(e) => setCustomPrompt(e.target.value)}
                                    placeholder="e.g. You are a Senior React Developer. Always use TypeScript..."
                                    className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all"
                                />
                            </div>
                            <div className="p-4 flex justify-end gap-2 bg-zinc-950/30 border-t border-zinc-800">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveCustom}
                                    className="px-4 py-2 bg-accent-primary hover:bg-accent-primary/90 text-white text-sm font-medium rounded-lg transition-all active:scale-95 shadow-lg shadow-accent-primary/20"
                                >
                                    Save & Apply
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
