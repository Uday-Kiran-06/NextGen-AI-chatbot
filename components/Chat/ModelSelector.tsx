import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Cpu, Check, Zap, Atom, Server, Bot, Sparkles } from 'lucide-react';
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
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className="px-2.5 md:px-3 py-2 flex items-center gap-2 rounded-xl transition-all duration-200"
                style={{
                    backgroundColor: isOpen ? 'var(--sidebar-hover)' : 'transparent',
                    color: 'var(--foreground)',
                    opacity: isOpen ? 1 : 0.6
                }}
                title="Switch Model"
            >
                <activeModel.icon size={18} style={{ color: 'var(--accent-primary)' }} />
                <span className="hidden md:block text-xs font-semibold">{activeModel.label.split(' ')[0]}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Sparkles size={14} style={{ color: 'var(--accent-primary)', opacity: 0.6 }} />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop for mobile */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[59] md:hidden"
                            onClick={() => setIsOpen(false)}
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="fixed md:absolute z-[60] overflow-hidden shadow-2xl"
                            style={{
                                backgroundColor: 'var(--sidebar-bg)',
                                border: '1px solid var(--sidebar-border)',
                                backdropFilter: 'blur(16px)'
                            }}
                        >
                            {/* Mobile: Full width bottom sheet */}
                            <div className="fixed bottom-0 left-0 right-0 rounded-t-3xl md:hidden">
                                <div className="flex justify-center pt-3 pb-2">
                                    <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--foreground)', opacity: 0.2 }} />
                                </div>
                                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
                                    <div className="flex items-center gap-2">
                                        <Atom size={16} style={{ color: 'var(--accent-primary)' }} />
                                        <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Select AI Model</h3>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 p-3 max-h-[60vh] overflow-y-auto">
                                    {MODELS.map((m, i) => (
                                        <motion.button
                                            key={m.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => { onModelChange(m.id); setIsOpen(false); }}
                                            className={cn(
                                                "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                                                modelId === m.id 
                                                    ? "" 
                                                    : "hover:scale-[1.01]"
                                            )}
                                            style={{
                                                backgroundColor: modelId === m.id ? 'var(--accent-glow)' : 'transparent'
                                            }}
                                        >
                                            <div 
                                                className="p-2.5 rounded-xl transition-all"
                                                style={{
                                                    backgroundColor: modelId === m.id ? 'var(--accent-primary)' : 'var(--sidebar-hover)',
                                                    color: modelId === m.id ? 'white' : 'var(--foreground)'
                                                }}
                                            >
                                                <m.icon size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                                                    {m.label}
                                                    {modelId === m.id && <Check size={14} style={{ color: 'var(--accent-primary)' }} />}
                                                </div>
                                                <div className="text-xs mt-0.5" style={{ color: 'var(--foreground)', opacity: 0.5 }}>{m.desc}</div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop: Dropdown */}
                            <div className="hidden md:block absolute bottom-full right-0 mb-2 w-64 rounded-xl">
                                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
                                    <div className="flex items-center gap-2">
                                        <Atom size={16} style={{ color: 'var(--accent-primary)' }} />
                                        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--foreground)', opacity: 0.6 }}>Select AI Model</h3>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 p-2 max-h-80 overflow-y-auto">
                                    {MODELS.map((m, i) => (
                                        <motion.button
                                            key={m.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            onClick={() => { onModelChange(m.id); setIsOpen(false); }}
                                            className="w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left group"
                                            style={{
                                                backgroundColor: modelId === m.id ? 'var(--accent-glow)' : 'transparent'
                                            }}
                                        >
                                            <div 
                                                className="p-2 rounded-lg transition-all"
                                                style={{
                                                    backgroundColor: modelId === m.id ? 'var(--accent-primary)' : 'var(--sidebar-hover)',
                                                    color: modelId === m.id ? 'white' : 'var(--foreground)'
                                                }}
                                            >
                                                <m.icon size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-semibold flex items-center gap-1.5" style={{ color: 'var(--foreground)' }}>
                                                    {m.label}
                                                    {modelId === m.id && <Check size={12} style={{ color: 'var(--accent-primary)' }} />}
                                                </div>
                                                <div className="text-[10px] mt-0.5" style={{ color: 'var(--foreground)', opacity: 0.4 }}>{m.desc}</div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
