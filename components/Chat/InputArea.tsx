import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Loader2, X, Image as ImageIcon, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface InputAreaProps {
    onSendMessage: (text: string, files: any[]) => void;
    isGenerating: boolean;
}

export default function InputArea({ onSendMessage, isGenerating }: InputAreaProps) {
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [files, setFiles] = useState<{ name: string, data: string, mimeType: string, preview: string }[]>([]);
    const [interimTranscript, setInterimTranscript] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`; // Set to scrollHeight but max 128px
        }
    }, [input]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if ((window as any).recognitionInstance) {
                (window as any).recognitionInstance.stop();
            }
        };
    }, []);

    // Voice Interaction Logic (Same as before, just kept for functionality)
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
                alert("Please allow microphone access to use this feature.");
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

            recognition.start();
        } else {
            alert("Speech recognition not supported in this browser.");
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
        onSendMessage(input, files);
        setInput('');
        setFiles([]);
        setIsRecording(false);
        setInterimTranscript('');
        (window as any).recognitionInstance?.stop();
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-full relative z-20">
            {/* Voice Visualizer */}
            {isRecording && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[120%] z-50">
                    <div className="bg-black/80 backdrop-blur-xl text-white text-sm px-6 py-3 rounded-full flex items-center gap-3 border border-white/10 shadow-[0_0_30px_-5px_var(--accent)] animate-in fade-in slide-in-from-bottom-5">
                        <div className="flex gap-1 items-end h-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-1 bg-accent rounded-full animate-music-bar" style={{ animationDelay: `${i * 0.1}s`, height: '100%' }} />
                            ))}
                        </div>
                        <span className="font-medium tracking-wide">{interimTranscript || "Listening..."}</span>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 rounded-full p-0 text-muted-foreground hover:text-white hover:bg-white/10 ml-2"
                            onClick={toggleRecording}
                        >
                            <X size={14} />
                        </Button>
                    </div>
                </div>
            )}

            {/* File Previews */}
            {files.length > 0 && (
                <div className="flex gap-3 mb-3 overflow-x-auto pb-2 scrollbar-hide px-2">
                    {files.map((f: any, i) => (
                        <div key={i} className="relative group shrink-0 animate-in fade-in zoom-in-95 duration-200">
                            <div className="w-20 h-20 rounded-xl border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center shadow-lg">
                                {f.mimeType.startsWith('image/') ? (
                                    <img src={f.preview} alt={f.name} className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon size={24} className="text-muted-foreground" />
                                )}
                            </div>
                            <button
                                onClick={() => removeFile(i)}
                                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Main Input Box */}
            <div className={cn(
                "glass-panel rounded-3xl p-2 flex items-end gap-2 relative transition-all duration-300 ring-1 ring-white/5",
                "focus-within:ring-accent focus-within:shadow-[0_0_30px_-10px_var(--accent-glow)]"
            )}>
                {/* Attach Button */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => fileInputRef.current?.click()}
                                className="h-10 w-10 rounded-full text-muted-foreground hover:text-white hover:bg-white/10 shrink-0"
                            >
                                <Paperclip size={20} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Attach files</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

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
                    placeholder="Ask anything..."
                    className="bg-transparent border-0 text-white placeholder:text-muted-foreground focus:ring-0 flex-1 resize-none py-3 min-h-[44px] max-h-32 scrollbar-hide outline-none text-sm leading-relaxed"
                    rows={1}
                />

                <div className="flex items-center gap-1 pb-0.5">
                    {/* Voice Input */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className={cn(
                                        "h-10 w-10 rounded-full transition-all",
                                        isRecording ? "text-red-400 bg-red-500/10 animate-pulse" : "text-muted-foreground hover:text-white"
                                    )}
                                    onClick={toggleRecording}
                                >
                                    <Mic size={20} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Voice Input</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* Send Button */}
                    <Button
                        onClick={handleSend}
                        disabled={(!input.trim() && files.length === 0) || isGenerating}
                        size="icon"
                        className={cn(
                            "h-10 w-10 rounded-full bg-gradient-to-tr from-accent to-violet-600 border border-white/10 shadow-lg transition-all hover:scale-105 hover:shadow-accent/25",
                            isGenerating && "opacity-80"
                        )}
                    >
                        {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
                    </Button>
                </div>
            </div>

            <div className="text-center mt-3">
                <p className="text-[10px] text-muted-foreground">
                    NextGen AI can make mistakes. Check important info.
                </p>
            </div>
        </div>
    );
}
