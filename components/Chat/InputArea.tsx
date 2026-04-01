'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, X, Image as ImageIcon, ChevronDown, Check, Zap, PenTool, Square, Globe, FileText } from 'lucide-react';
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
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px';
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

    return (
        <div className="relative w-full z-10">
            {/* Subtle Gradient Fade */}
            <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            
            <AnimatePresence>
                {isRecording && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 pointer-events-none"
                    >
                        <div 
                            className="flex items-center gap-3 px-5 py-2.5 rounded-full shadow-xl backdrop-blur-md border"
                            style={{ 
                                backgroundColor: 'var(--glass-bg)',
                                borderColor: 'var(--glass-border)'
                            }}
                        >
                            <div className="flex gap-0.5 items-center h-4">
                                {[1, 2, 3].map(i => (
                                    <motion.div 
                                        key={i} 
                                        className="w-0.5 rounded-full"
                                        style={{ backgroundColor: '#ef4444' }}
                                        animate={{ 
                                            height: [8, 16, 8] 
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
                            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                                {interimTranscript || "Listening..."}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-3 mb-3 overflow-x-auto pb-2 scrollbar-hide"
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
                                    className="w-16 h-16 rounded-xl overflow-hidden border shadow-lg flex items-center justify-center"
                                    style={{ 
                                        backgroundColor: 'var(--glass-bg)',
                                        borderColor: 'var(--glass-border)'
                                    }}
                                >
                                    {file.mimeType.startsWith('image/') ? (
                                        <img src={file.preview} alt="upload" className="w-full h-full object-cover" />
                                    ) : (
                                        <FileText size={24} style={{ color: 'var(--accent-primary)' }} />
                                    )}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removeFile(i)}
                                    className="absolute -top-2 -right-2 p-1.5 rounded-full shadow-lg flex items-center justify-center"
                                    style={{ 
                                        backgroundColor: '#ef4444', 
                                        color: 'white'
                                    }}
                                >
                                    <X size={12} />
                                </motion.button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Input Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={cn(
                    "relative overflow-hidden transition-all duration-300 rounded-2xl",
                    isDragging 
                        ? "ring-2 ring-[var(--accent-primary)] shadow-xl" 
                        : "hover:shadow-lg"
                )}
                style={{
                    backgroundColor: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    backdropFilter: 'blur(16px)'
                }}
            >
                {/* Inner Glow Effect */}
                <div 
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 70%)'
                    }}
                />

                <div className="relative flex items-end gap-2 p-2 md:p-3">
                    {/* Attach Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2.5 md:p-3 rounded-xl transition-all duration-200 shrink-0 group"
                        style={{ color: 'var(--foreground)', opacity: 0.5 }}
                        title="Attach Files"
                    >
                        <Paperclip size={20} className="md:w-5 md:h-5 w-5 h-5 group-hover:text-[var(--accent-primary)] transition-colors" />
                    </motion.button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept="image/*,application/pdf,text/*"
                        onChange={handleFileSelect}
                    />

                    {/* Persona Selector */}
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
                        className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none outline-none resize-none py-2.5 md:py-3 scrollbar-hide text-[15px] md:text-base leading-relaxed placeholder:text-current transition-all duration-200"
                        style={{ 
                            color: 'var(--foreground)',
                            opacity: 0.6
                        }}
                        rows={1}
                    />

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 shrink-0 pb-0.5">
                        {/* Web Search Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setUseWebSearch(!useWebSearch)}
                            className={cn(
                                "p-2.5 rounded-xl transition-all duration-200"
                            )}
                            style={{
                                backgroundColor: useWebSearch ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                                color: useWebSearch ? '#10b981' : 'var(--foreground)',
                                opacity: useWebSearch ? 1 : 0.5
                            }}
                            title={useWebSearch ? "Web Search Enabled" : "Enable Web Search"}
                        >
                            <Globe size={18} className={cn(useWebSearch && "animate-pulse")} />
                        </motion.button>

                        {/* Model Selector */}
                        <ModelSelector
                            modelId={modelId}
                            onModelChange={onModelChange}
                            isOpen={isModelDropdownOpen}
                            setIsOpen={setIsModelDropdownOpen}
                            dropdownRef={modelDropdownRef}
                        />

                        {/* Send / Stop / Mic */}
                        <AnimatePresence mode="popLayout">
                            {input.trim() || files.length > 0 || isGenerating ? (
                                <motion.button
                                    key="send"
                                    initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={isGenerating ? onStop : handleSend}
                                    className="p-3 md:p-3.5 rounded-xl shadow-lg flex items-center justify-center"
                                    style={{
                                        background: isGenerating 
                                            ? '#ef4444' 
                                            : 'var(--accent-primary)',
                                        color: 'white'
                                    }}
                                    aria-label={isGenerating ? "Stop Generation" : "Send Message"}
                                >
                                    {isGenerating ? (
                                        <Square size={18} fill="currentColor" className="animate-pulse" />
                                    ) : (
                                        <Send size={18} className="translate-x-0.5" />
                                    )}
                                </motion.button>
                            ) : (
                                <motion.button
                                    key="mic"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.15 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleRecording}
                                    className="relative p-3 md:p-3.5 rounded-xl transition-all duration-200"
                                    style={{
                                        backgroundColor: isRecording ? '#ef4444' : 'transparent',
                                        color: isRecording ? 'white' : 'var(--foreground)',
                                        opacity: isRecording ? 1 : 0.5
                                    }}
                                    title={isRecording ? "Stop Recording" : "Voice Input"}
                                >
                                    {isRecording && (
                                        <>
                                            <span className="absolute inset-0 rounded-xl border-2 border-red-500 animate-ping opacity-30" />
                                            <span className="absolute inset-[-4px] rounded-xl border border-red-500/50 animate-ping opacity-20" />
                                        </>
                                    )}
                                    <Mic size={18} className={cn(isRecording && "animate-pulse")} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* Helper Text */}
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-[11px] mt-2"
                style={{ color: 'var(--foreground)', opacity: 0.3 }}
            >
                Press Enter to send • Shift + Enter for new line
            </motion.p>
        </div>
    );
}
