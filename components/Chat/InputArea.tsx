import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Loader2, X, Image as ImageIcon, ChevronDown, Sparkles, Check, Zap, PenTool, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, vibrate } from '@/lib/utils';
import { toast } from 'sonner';

interface InputAreaProps {
    onSendMessage: (text: string, files: any[]) => void;
    isGenerating: boolean;
    modelId: string;
    onModelChange: (modelId: string) => void;
    onStop?: () => void;
}

const PERSONAS = [
    { id: 'Standard AI', label: 'Standard', icon: Sparkles, desc: 'Balanced and helpful' },
    { id: "You are a senior software engineer called 'CodeMaster'.", label: 'Coder', icon: Zap, desc: 'Technical and precise' },
    { id: 'You are a creative copywriter.', label: 'Creative', icon: ImageIcon, desc: 'Inspiring and expressive' },
    { id: 'You are a data analyst.', label: 'Analyst', icon: PenTool, desc: 'Logical and insightful' },
    { id: "You are a sarcastic, witty, and slightly cynical AI assistant. You use dark humor and irony frequently.", label: 'Sarcastic', icon: Mic, desc: 'Witty and cynical' },
];

const MODELS = [
    { id: 'gemini-1.5-flash-latest', label: 'Flash', icon: Zap, desc: 'Fast & efficient' },
    { id: 'gemini-1.5-pro-latest', label: 'Pro', icon: Sparkles, desc: 'Deep reasoning' },
];

export default function InputArea({ onSendMessage, isGenerating, modelId, onModelChange, onStop }: InputAreaProps) {
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [files, setFiles] = useState<{ name: string, data: string, mimeType: string, preview: string }[]>([]);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [persona, setPersona] = useState('Standard AI');
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
    const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const modelDropdownRef = useRef<HTMLDivElement>(null);
    const personaDropdownRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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

        return () => {
            if ((window as any).recognitionInstance) {
                (window as any).recognitionInstance.stop();
            }
        };
    }, []);

    // Helper to get active label
    const activePersona = PERSONAS.find(p => p.id === persona) || PERSONAS[0];
    const activeModel = MODELS.find(m => m.id === modelId) || MODELS[0];

    // Voice Interaction
    const toggleRecording = async () => {
        if (isRecording) {
            setIsRecording(false);
            setInterimTranscript('');
            (window as any).recognitionInstance?.stop();
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (err) {
                console.error("Microphone permission denied:", err);
                toast.error("Please allow microphone access to use this feature.");
                return;
            }

            const recognition = new SpeechRecognition();
            (window as any).recognitionInstance = recognition;
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsRecording(true);
                setInterimTranscript('');
                vibrate(20);
            };

            recognition.onend = () => {
                setIsRecording(false);
                setInterimTranscript('');
            };

            recognition.onresult = (event: any) => {
                let finalTranscript = '';
                let interim = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interim += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript) {
                    setInput(prev => prev + (prev ? ' ' : '') + finalTranscript);
                }
                setInterimTranscript(interim);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsRecording(false);
            };

            recognition.start();
        } else {
            toast.error("Speech recognition not supported in this browser.");
        }
    };

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

    const handleSend = () => {
        if ((!input.trim() && files.length === 0) || isGenerating) return;
        vibrate(10);
        onSendMessage(input, files);
        setInput('');
        setFiles([]);
        setIsRecording(false);
        setInterimTranscript('');
        (window as any).recognitionInstance?.stop();
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
        <div className="p-4 md:p-6 pb-6 relative">
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
                    "glass-panel rounded-[20px] md:rounded-2xl p-1 md:p-2 flex items-end gap-1 md:gap-2 relative transition-all duration-300",
                    isDragging ? "ring-2 ring-accent-primary bg-accent-primary/5 scale-[1.01]" : "focus-within:ring-2 focus-within:ring-accent-primary/50"
                )}
            >
                {/* Attach Button */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-gray-400 hover:text-accent-primary transition-all duration-300 rounded-full hover:bg-white/5 hover:scale-110 active:scale-95 shrink-0"
                    title="Attach Files"
                    aria-label="Attach Files from Computer"
                >
                    <Paperclip size={20} />
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
                <div className="relative shrink-0 flex items-center h-[40px] md:h-[44px]" ref={personaDropdownRef}>
                    <button
                        onClick={() => setIsPersonaDropdownOpen(!isPersonaDropdownOpen)}
                        className="px-2 sm:px-3 py-1.5 md:py-2 flex items-center gap-1 sm:gap-2 bg-transparent text-[11px] sm:text-xs font-bold text-gray-500 hover:text-accent-primary hover:bg-white/5 rounded-xl transition-all h-full"
                    >
                        <activePersona.icon size={16} className="sm:w-3.5 sm:h-3.5" />
                        <span className="hidden xs:block">{activePersona.label}</span>
                        <ChevronDown size={14} className={cn("transition-transform duration-300 sm:w-3 sm:h-3", isPersonaDropdownOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                        {isPersonaDropdownOpen && (
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
                                                setPersona(p.id);
                                                localStorage.setItem('nextgen_persona', p.id);
                                                setIsPersonaDropdownOpen(false);
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
                    <div className="relative" ref={modelDropdownRef}>
                        <button
                            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                            className="p-3 text-gray-400 hover:text-accent-primary transition-all duration-300 rounded-full hover:bg-white/5 hover:scale-110 active:scale-95"
                            title="Switch Model"
                            aria-label="Switch AI Model"
                        >
                            <activeModel.icon size={20} />
                        </button>

                        <AnimatePresence>
                            {isModelDropdownOpen && (
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
                                                    setIsModelDropdownOpen(false);
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

                    <AnimatePresence mode="popLayout">
                        {input.trim() || files.length > 0 || isGenerating ? (
                            <motion.button
                                key="send"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.15 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={isGenerating ? onStop : handleSend}
                                className={cn(
                                    "p-3 rounded-full transition-all duration-300",
                                    isGenerating
                                        ? "bg-red-500/90 text-white shadow-lg shadow-red-500/20 hover:bg-red-600"
                                        : "bg-accent-primary text-white shadow-lg shadow-accent-primary/20 hover:bg-accent-primary/90"
                                )}
                                aria-label={isGenerating ? "Stop Generation" : "Send Message"}
                                title={isGenerating ? "Stop Generation" : "Send"}
                            >
                                {isGenerating ? <Square size={18} fill="currentColor" /> : <Send size={20} />}
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
                                    "relative p-3 transition-all duration-300 rounded-full hover:scale-110 active:scale-95 shrink-0 z-10",
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
                                <Mic size={20} className={cn("relative z-10", isRecording && "animate-pulse")} />
                            </motion.button>
                        )}
                    </AnimatePresence>

                </div>
            </div>

            <div className="flex justify-center mt-2 h-4">
                {/* Reserved space for potential future indicators */}
            </div>
        </div>
    );
}

