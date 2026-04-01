'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, X, Square, Globe, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, vibrate } from '@/lib/utils';
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

    useEffect(() => {
        if (autoSendTrigger > 0) {
            handleSend();
        }
    }, [autoSendTrigger]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
        }
    }, [input]);

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

    const hasInput = input.trim().length > 0 || files.length > 0;

    return (
        <div className="relative w-full z-10" style={{ touchAction: 'manipulation' }}>
            {/* Recording Indicator */}
            <AnimatePresence>
                {isRecording && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 pointer-events-none"
                    >
                        <div 
                            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-xl"
                            style={{ 
                                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                border: '1px solid rgba(239, 68, 68, 0.3)'
                            }}
                        >
                            <div className="flex gap-0.5 items-center h-4">
                                {[1, 2, 3].map(i => (
                                    <motion.div 
                                        key={i} 
                                        className="w-0.5 rounded-full bg-red-500"
                                        animate={{ 
                                            height: [6, 16, 6] 
                                        }}
                                        transition={{ 
                                            duration: 0.5, 
                                            repeat: Infinity, 
                                            delay: i * 0.1,
                                            ease: "easeInOut"
                                        }} 
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
                                {interimTranscript || "Listening..."}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* File Attachments Preview */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-2 mb-2 overflow-x-auto pb-1 scrollbar-hide px-1"
                    >
                        {files.map((file, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className="relative group shrink-0"
                            >
                                <div 
                                    className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden shadow-md flex items-center justify-center"
                                    style={{ 
                                        backgroundColor: 'var(--sidebar-hover)',
                                        border: '1px solid var(--glass-border)'
                                    }}
                                >
                                    {file.mimeType.startsWith('image/') ? (
                                        <img src={file.preview} alt="upload" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-0.5">
                                            <FileText size={14} className="md:w-4 md:h-4" style={{ color: 'var(--accent-primary)' }} />
                                            <span className="text-[7px] md:text-[8px] truncate max-w-10 md:max-w-12 px-0.5" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                                                {file.name.split('.').pop()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeFile(i)}
                                    className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 rounded-full shadow-md flex items-center justify-center active:scale-90"
                                    style={{ 
                                        backgroundColor: 'var(--accent-primary)',
                                        color: 'white',
                                        touchAction: 'manipulation'
                                    }}
                                >
                                    <X size={8} className="md:w-[10px] md:h-[10px]" />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Input Container */}
            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className="relative rounded-2xl transition-all duration-300"
                style={{
                    backgroundColor: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    backdropFilter: `blur(var(--input-blur))`,
                    boxShadow: isDragging 
                        ? '0 0 0 2px var(--accent-primary), 0 8px 32px rgba(124, 58, 237, 0.2)' 
                        : '0 4px 24px rgba(0, 0, 0, 0.12)'
                }}
            >
                {/* Top Row - Selectors */}
                <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
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
                    <ModelSelector
                        modelId={modelId}
                        onModelChange={onModelChange}
                        isOpen={isModelDropdownOpen}
                        setIsOpen={setIsModelDropdownOpen}
                        dropdownRef={modelDropdownRef}
                    />
                </div>

                {/* Divider */}
                <div className="mx-3 h-px" style={{ backgroundColor: 'var(--glass-border)' }} />

                {/* Input Row */}
                <div className="relative flex items-center gap-2 p-2">
                    {/* Attach Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 shrink-0 active:scale-95"
                        style={{ color: 'var(--foreground)', opacity: 'var(--text-muted)', touchAction: 'manipulation' }}
                        title="Attach Files"
                    >
                        <Paperclip size={18} />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept="image/*,application/pdf,text/*"
                        onChange={handleFileSelect}
                    />

                    {/* Text Input */}
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message AI..."
                        className="flex-1 max-h-32 min-h-[36px] bg-transparent border-none outline-none resize-none py-2 scrollbar-hide text-[14px] leading-relaxed placeholder:opacity-40"
                        style={{ color: 'var(--foreground)' }}
                        rows={1}
                    />

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                        {/* Web Search Toggle */}
                        <button
                            onClick={() => setUseWebSearch(!useWebSearch)}
                            className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 active:scale-95"
                            style={{
                                backgroundColor: useWebSearch ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                                color: useWebSearch ? '#10b981' : 'var(--foreground)',
                                opacity: useWebSearch ? 1 : 'var(--text-muted)',
                                touchAction: 'manipulation'
                            }}
                            title={useWebSearch ? "Web Search Enabled" : "Enable Web Search"}
                        >
                            <Globe size={18} className={cn(useWebSearch && "animate-pulse")} />
                        </button>

                        {/* Send / Stop / Mic Button */}
                        <AnimatePresence mode="popLayout">
                            {hasInput || isGenerating ? (
                                <button
                                    key="send"
                                    onClick={isGenerating ? onStop : handleSend}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg shadow-md active:scale-95"
                                    style={{
                                        background: isGenerating 
                                            ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                                            : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                                        color: 'white',
                                        touchAction: 'manipulation'
                                    }}
                                    aria-label={isGenerating ? "Stop Generation" : "Send Message"}
                                >
                                    {isGenerating ? (
                                        <Square size={16} fill="currentColor" className="animate-pulse" />
                                    ) : (
                                        <Send size={16} />
                                    )}
                                </button>
                            ) : (
                                <button
                                    key="mic"
                                    onClick={toggleRecording}
                                    className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 active:scale-95"
                                    style={{
                                        backgroundColor: isRecording ? '#ef4444' : 'transparent',
                                        color: isRecording ? 'white' : 'var(--foreground)',
                                        opacity: isRecording ? 1 : 'var(--text-muted)',
                                        touchAction: 'manipulation'
                                    }}
                                    title={isRecording ? "Stop Recording" : "Voice Input"}
                                >
                                    {isRecording && (
                                        <>
                                            <span className="absolute inset-0 rounded-lg border-2 border-red-500 animate-ping opacity-30" />
                                            <span className="absolute inset-[-3px] rounded-lg border border-red-500/50 animate-ping opacity-20" />
                                        </>
                                    )}
                                    <Mic size={18} className={cn(isRecording && "animate-pulse")} />
                                </button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
