'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Code2, Lightbulb, BarChart3, PenTool, ChevronDown, Check, Ghost, X } from 'lucide-react';
import { cn, vibrate } from '@/lib/utils';

export const PERSONAS = [
    { id: 'Standard AI', label: 'Standard', icon: Bot, desc: 'Balanced & helpful', color: '#7c3aed' },
    { id: "You are a senior software engineer called 'CodeMaster'.", label: 'Coder', icon: Code2, desc: 'Technical & precise', color: '#10b981' },
    { id: 'You are a creative copywriter.', label: 'Creative', icon: Lightbulb, desc: 'Inspiring & expressive', color: '#f59e0b' },
    { id: 'You are a data analyst.', label: 'Analyst', icon: BarChart3, desc: 'Logical & insightful', color: '#06b6d4' },
    { id: "You are a sarcastic, witty, and slightly cynical AI assistant.", label: 'Witty', icon: Ghost, desc: 'Sarcastic humor', color: '#ec4899' },
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customPrompt, setCustomPrompt] = useState('');
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isOpen && buttonRef.current && !isMobile) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.top - 320,
                left: rect.left
            });
        }
    }, [isOpen, isMobile]);

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

    const dropdownContent = isOpen && (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9998]"
                onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile Bottom Sheet */}
            {isMobile ? (
                <motion.div
                    initial={{ opacity: 1, y: '100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 1, y: '100%' }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    className="fixed inset-x-0 bottom-0 z-[9999] rounded-t-3xl overflow-hidden"
                    style={{
                        backgroundColor: 'var(--sidebar-bg)',
                        border: '1px solid var(--sidebar-border)',
                        borderBottom: 'none',
                        maxHeight: '70vh'
                    }}
                >
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--foreground)', opacity: 0.2 }} />
                    </div>
                    
                    {/* Header */}
                    <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--sidebar-border)' }}>
                        <div className="flex items-center gap-2">
                            <Bot size={18} style={{ color: activePersona.color }} />
                            <h3 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>AI Persona</h3>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 flex items-center justify-center rounded-full"
                            style={{ touchAction: 'manipulation' }}
                        >
                            <X size={18} style={{ color: 'var(--foreground)', opacity: 'var(--text-muted)' }} />
                        </button>
                    </div>
                    
                    {/* Persona List */}
                    <div className="flex flex-col gap-1 p-3 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 100px)' }}>
                        {PERSONAS.map((p, i) => (
                            <motion.button
                                key={p.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => { onPersonaChange(p.id); setIsOpen(false); vibrate(5); }}
                                className="w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left active:scale-[0.98]"
                                style={{
                                    backgroundColor: persona === p.id ? 'var(--accent-glow)' : 'transparent',
                                    border: persona === p.id ? '1px solid var(--accent-primary)' : '1px solid transparent',
                                    touchAction: 'manipulation'
                                }}
                            >
                                <div 
                                    className="w-11 h-11 flex items-center justify-center rounded-xl"
                                    style={{
                                        backgroundColor: persona === p.id ? p.color : 'var(--glass-bg)',
                                        color: persona === p.id ? 'white' : p.color
                                    }}
                                >
                                    <p.icon size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                                        {p.label}
                                        {persona === p.id && <Check size={16} style={{ color: p.color }} />}
                                    </span>
                                    <p className="text-sm mt-0.5" style={{ color: 'var(--foreground)', opacity: 'var(--text-secondary)' }}>{p.desc}</p>
                                </div>
                            </motion.button>
                        ))}
                        <div className="h-px my-2" style={{ backgroundColor: 'var(--sidebar-border)' }} />
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: PERSONAS.length * 0.03 }}
                            onClick={handleOpenCustom}
                            className="w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left active:scale-[0.98]"
                            style={{ touchAction: 'manipulation' }}
                        >
                            <div 
                                className="w-11 h-11 flex items-center justify-center rounded-xl"
                                style={{
                                    backgroundColor: isCustomActive ? 'var(--accent-primary)' : 'var(--glass-bg)',
                                    color: isCustomActive ? 'white' : 'var(--foreground)'
                                }}
                            >
                                <PenTool size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                                    Custom
                                    {isCustomActive && <Check size={16} style={{ color: 'var(--accent-primary-light)' }} />}
                                </span>
                                <p className="text-sm mt-0.5" style={{ color: 'var(--foreground)', opacity: 'var(--text-secondary)' }}>Define your own</p>
                            </div>
                        </motion.button>
                    </div>
                </motion.div>
            ) : (
                /* Desktop Dropdown */
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="fixed w-60 rounded-2xl overflow-hidden z-[9999] shadow-2xl"
                    style={{
                        backgroundColor: 'var(--sidebar-bg)',
                        border: '1px solid var(--sidebar-border)',
                        top: `${Math.max(16, position.top)}px`,
                        left: `${Math.max(16, Math.min(position.left, window.innerWidth - 256))}px`
                    }}
                >
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
                        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--foreground)', opacity: 'var(--text-secondary)' }}>AI Persona</h3>
                    </div>
                    <div className="flex flex-col p-1.5">
                        {PERSONAS.map((p, i) => (
                            <motion.button
                                key={p.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => { onPersonaChange(p.id); setIsOpen(false); vibrate(5); }}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                                    persona === p.id ? "bg-[var(--accent-glow)]" : "hover:bg-[var(--sidebar-hover)]"
                                )}
                            >
                                <div 
                                    className="p-2 rounded-lg"
                                    style={{
                                        backgroundColor: persona === p.id ? p.color : 'var(--sidebar-hover)',
                                        color: persona === p.id ? 'white' : p.color
                                    }}
                                >
                                    <p.icon size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                                        {p.label}
                                        {persona === p.id && <Check size={14} style={{ color: p.color }} />}
                                    </span>
                                    <p className="text-xs" style={{ color: 'var(--foreground)', opacity: 'var(--text-secondary)' }}>{p.desc}</p>
                                </div>
                            </motion.button>
                        ))}
                        <div className="h-px my-2" style={{ backgroundColor: 'var(--sidebar-border)' }} />
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: PERSONAS.length * 0.03 }}
                            onClick={handleOpenCustom}
                            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left hover:bg-[var(--sidebar-hover)]"
                        >
                            <div 
                                className="p-2 rounded-lg"
                                style={{
                                    backgroundColor: isCustomActive ? 'var(--accent-primary)' : 'var(--sidebar-hover)',
                                    color: isCustomActive ? 'white' : 'var(--foreground)'
                                }}
                            >
                                <PenTool size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                                    Custom
                                    {isCustomActive && <Check size={14} style={{ color: 'var(--accent-primary-light)' }} />}
                                </span>
                                <p className="text-xs" style={{ color: 'var(--foreground)', opacity: 'var(--text-secondary)' }}>Define your own</p>
                            </div>
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </>
    );

    return (
        <>
            <div className="relative shrink-0 flex items-center" ref={dropdownRef}>
                <button
                    ref={buttonRef}
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all active:scale-95"
                    style={{
                        backgroundColor: isOpen || isCustomActive ? 'var(--accent-glow)' : 'transparent',
                        border: '1px solid',
                        borderColor: isOpen || isCustomActive ? 'var(--accent-primary)' : 'transparent',
                        color: 'var(--foreground)',
                        touchAction: 'manipulation',
                        minHeight: '32px'
                    }}
                >
                    {isCustomActive ? (
                        <PenTool size={14} style={{ color: 'var(--accent-primary-light)' }} />
                    ) : (
                        <activePersona.icon size={14} style={{ color: activePersona.color }} />
                    )}
                    <span className="text-xs font-medium">{isCustomActive ? 'Custom' : activePersona.label}</span>
                    <ChevronDown 
                        size={12} 
                        className={cn("transition-transform", isOpen && "rotate-180")} 
                        style={{ opacity: 'var(--text-muted)' }}
                    />
                </button>

                {typeof document !== 'undefined' && createPortal(
                    <AnimatePresence>{dropdownContent}</AnimatePresence>,
                    document.body
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[10000]"
                            style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[10001] overflow-hidden shadow-2xl rounded-2xl"
                            style={{
                                backgroundColor: 'var(--sidebar-bg)',
                                border: '1px solid var(--sidebar-border)'
                            }}
                        >
                            <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
                                <div className="flex items-center gap-2">
                                    <PenTool size={18} style={{ color: 'var(--accent-primary-light)' }} />
                                    <h3 className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Custom Persona</h3>
                                </div>
                                <button 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="p-1.5 rounded-lg"
                                    style={{ color: 'var(--foreground)', opacity: 'var(--text-muted)' }}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-5 space-y-4">
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)', opacity: 'var(--text-secondary)' }}>
                                    Define how the AI should behave. This overrides default personas.
                                </p>
                                <textarea
                                    value={customPrompt}
                                    onChange={(e) => setCustomPrompt(e.target.value)}
                                    placeholder="e.g. You are a Senior React Developer..."
                                    className="w-full h-36 p-4 rounded-xl text-sm resize-none outline-none transition-all"
                                    style={{ 
                                        backgroundColor: 'var(--sidebar-hover)',
                                        border: '1px solid var(--sidebar-border)',
                                        color: 'var(--foreground)'
                                    }}
                                />
                            </div>
                            <div className="p-4 flex justify-end gap-3" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium rounded-lg"
                                    style={{ color: 'var(--foreground)', opacity: 'var(--text-secondary)' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveCustom}
                                    className="px-4 py-2 text-sm font-semibold rounded-lg text-white"
                                    style={{ backgroundColor: 'var(--accent-primary)' }}
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
