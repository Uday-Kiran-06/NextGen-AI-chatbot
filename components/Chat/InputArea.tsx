import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Loader2, X, Image as ImageIcon, ChevronDown, Sparkles, Check, Zap, PenTool, Square, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, vibrate } from '@/lib/utils';
import { AttractiveIcon } from '../Shared/AttractiveIcon';
import { toast } from 'sonner';
import ModelSelector from './ModelSelector';
import PersonaSelector from './PersonaSelector';
import { FileAttachment } from './types';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface InputAreaProps {
    onSendMessage: (text: string, files: FileAttachment[], useWebSearch?: boolean) => void;
    isGenerating: boolean;
    modelId: string;
    onModelChange: (modelId: string) => void;
    onStop?: () => void;
}

export default function InputArea({ onSendMessage, isGenerating, modelId, onModelChange, onStop }: InputAreaProps) {
    const [input, setInput] = useState('');
    const [files, setFiles] = useState<FileAttachment[]>([]);
    const [persona, setPersona] = useState('Standard AI');
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const modelDropdownRef = useRef<HTMLDivElement>(null);
    const personaDropdownRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [autoSendTrigger, setAutoSendTrigger] = useState(0);

    const { isRecording, interimTranscript, toggleRecording, stopRecording } = useSpeechRecognition({
        onResult: (transcript) => {
            setInput((prev) => prev + (prev ? ' ' : '') + transcript);
        },
        onSilence: () => {
            setAutoSendTrigger(prev => prev + 1);
        }
    });

    // Auto-Send effect
    useEffect(() => {
        if (autoSendTrigger > 0) {
            handleSend();
        }
    }, [autoSendTrigger]);

    // Auto-expand textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px';
        }
    }, [input]);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
                setIsModelDropdownOpen(false);
            }
            if (personaDropdownRef.current && !personaDropdownRef.current.contains(event.target as Node)) {
                setIsPersonaDropdownOpen(false);
            }
        };

        if (isModelDropdownOpen || isPersonaDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModelDropdownOpen, isPersonaDropdownOpen]);

    // Cleanup on unmount
    useEffect(() => {
        const savedPersona = localStorage.getItem('nextgen_persona');
        if (savedPersona) setPersona(savedPersona);
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const processed = await Promise.all(newFiles.map(file => new Promise<any>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    const base64Data = result.split(',')[1];
                    resolve({
                        name: file.name,
                        mimeType: file.type,
                        data: base64Data,
                        preview: result
                    });
                };
                reader.readAsDataURL(file);
            })));
            setFiles(prev => [...prev, ...processed]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const [useWebSearch, setUseWebSearch] = useState(false);

    const handleSend = () => {
        if ((!input.trim() && files.length === 0) || isGenerating) return;
        vibrate(10);
        onSendMessage(input, files, useWebSearch);
        setInput('');
        setFiles([]);
        if (isRecording) {
            stopRecording();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            const newFiles = Array.from(e.dataTransfer.files);
            const processed = await Promise.all(newFiles.map(file => new Promise<any>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    const base64Data = result.split(',')[1];
                    resolve({
                        name: file.name,
                        mimeType: file.type,
                        data: base64Data,
                        preview: result
                    });
                };
                reader.readAsDataURL(file);
            })));
            setFiles(prev => [...prev, ...processed]);
        }
    };

    return (
        <div className="p-2 md:p-3 pb-[env(safe-area-inset-bottom,12px)] relative w-full z-10">
            <div className="absolute inset-0 top-[-30px] bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none -z-10" />
            {/* Voice Status Indicator */}
            <AnimatePresence>
                {isRecording && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-2 z-50 pointer-events-none"
                    >
                        <div className="bg-black/80 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 shadow-xl">
                            <div className="flex gap-1 items-center h-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-1 bg-red-500 rounded-full animate-music-bar" style={{ animationDelay: `${i * 0.15}s` }} />
                                ))}
                            </div>
                            <span>{interimTranscript || "Listening..."}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* File Previews */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide"
                    >
                        {files.map((file, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative group shrink-0"
                            >
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                    {file.mimeType.startsWith('image/') ? (
                                        <img src={file.preview} alt="upload" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                                            <Paperclip size={20} />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeFile(i)}
                                    className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={10} />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Standard Glass Wrapper */}
            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={cn(
                    "glass-panel rounded-[24px] md:rounded-2xl p-1 md:p-1.5 flex items-end gap-1 md:gap-2 relative transition-all duration-500 shadow-xl",
                    isDragging ? "ring-2 ring-accent-primary bg-accent-primary/5 scale-[1.01]" : "focus-within:ring-2 focus-within:ring-accent-primary/60 focus-within:shadow-[0_8px_48px_rgba(var(--accent-primary-rgb),0.15)] focus-within:-translate-y-0.5"
                )}
            >
                {/* Attach Button */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 md:p-2.5 text-gray-400 hover:text-accent-primary transition-all duration-300 rounded-xl hover:bg-white/5 shrink-0"
                    title="Attach Files"
                    aria-label="Attach Files from Computer"
                >
                    <AttractiveIcon icon={Paperclip} size={20} strokeWidth={1.5} />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept="image/*,application/pdf,text/*"
                    onChange={handleFileSelect}
                />

                {/* Persona Selector (Custom Dropdown) */}
                <PersonaSelector
                    persona={persona}
                    onPersonaChange={(newPersona) => {
                        setPersona(newPersona);
                        localStorage.setItem('nextgen_persona', newPersona);
                    }}
                    isOpen={isPersonaDropdownOpen}
                    setIsOpen={setIsPersonaDropdownOpen}
                    dropdownRef={personaDropdownRef}
                />

                {/* Text Input */}
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    className="flex-1 max-h-32 min-h-[40px] md:min-h-[44px] bg-transparent border-none outline-none text-foreground placeholder:text-gray-500 resize-none py-2.5 md:py-3 scrollbar-hide text-[15px] md:text-base leading-relaxed transition-all duration-200"
                    rows={1}
                />

                {/* Right Actions */}
                <div className="flex items-center gap-1 pb-1 shrink-0">
                    <button
                        onClick={() => setUseWebSearch(!useWebSearch)}
                        className={cn(
                            "p-2 rounded-full transition-all duration-300",
                            useWebSearch ? "bg-accent-primary/20 text-accent-primary" : "text-gray-400 hover:bg-white/5 hover:text-white"
                        )}
                        title={useWebSearch ? "Web Search Enabled" : "Enable Web Search"}
                    >
                        <AttractiveIcon 
                            icon={Globe} 
                            size={18} 
                            gradient={useWebSearch ? ['#7c3aed', '#db2777'] : undefined}
                            className={cn(useWebSearch && "animate-pulse")} 
                        />
                    </button>

                    <ModelSelector
                        modelId={modelId}
                        onModelChange={onModelChange}
                        isOpen={isModelDropdownOpen}
                        setIsOpen={setIsModelDropdownOpen}
                        dropdownRef={modelDropdownRef}
                    />

                    <AnimatePresence mode="popLayout">
                        {input.trim() || files.length > 0 || isGenerating ? (
                            <motion.button
                                key="send"
                                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={isGenerating ? onStop : handleSend}
                                className={cn(
                                    "p-3.5 md:p-3 rounded-full transition-all duration-300",
                                    isGenerating
                                        ? "bg-red-500 text-white shadow-lg shadow-red-500/40 hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/60"
                                        : "bg-accent-primary text-white shadow-lg shadow-accent-primary/40 hover:bg-accent-primary hover:shadow-xl hover:shadow-accent-primary/60"
                                )}
                                aria-label={isGenerating ? "Stop Generation" : "Send Message"}
                                title={isGenerating ? "Stop Generation" : "Send"}
                            >
                                {isGenerating ? (
                                    <AttractiveIcon icon={Square} size={20} gradient={['#ef4444', '#b91c1c']} glow />
                                ) : (
                                    <AttractiveIcon icon={Send} size={20} gradient={['#ffffff', '#ffffff']} strokeWidth={2} />
                                )}
                            </motion.button>
                        ) : (
                            <motion.button
                                key="mic"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.15 }}
                                onClick={toggleRecording}
                                className={cn(
                                    "relative p-3.5 md:p-3 transition-all duration-300 rounded-full hover:scale-110 active:scale-95 shrink-0 z-10",
                                    isRecording ? "bg-red-500 text-white shadow-lg shadow-red-500/40" : "text-gray-400 hover:text-accent-primary hover:bg-white/5"
                                )}
                                title={isRecording ? "Stop Recording" : "Voice Input"}
                                aria-label={isRecording ? "Stop Voice Recording" : "Start Voice Recording"}
                            >
                                {/* Recording Pulse Rings */}
                                {isRecording && (
                                    <>
                                        <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75" style={{ animationDuration: '1.5s' }} />
                                        <span className="absolute -inset-2 rounded-full border border-red-500/50 animate-ping opacity-50" style={{ animationDuration: '2s', animationDelay: '0.2s' }} />
                                    </>
                                )}
                                <AttractiveIcon 
                                    icon={Mic} 
                                    size={20} 
                                    gradient={isRecording ? ['#ffffff', '#ffffff'] : undefined}
                                    className={cn("relative z-10", isRecording && "animate-pulse")} 
                                />
                            </motion.button>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </div>
    );
}
