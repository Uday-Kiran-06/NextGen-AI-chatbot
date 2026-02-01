import React, { useState, useRef } from 'react';
import { Send, Mic, Paperclip, Loader2, X, Image as ImageIcon } from 'lucide-react';

interface InputAreaProps {
    onSendMessage: (text: string, files: any[]) => void;
    isGenerating: boolean;
}

export default function InputArea({ onSendMessage, isGenerating }: InputAreaProps) {
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [files, setFiles] = useState<{ name: string, data: string, mimeType: string, preview: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Voice Interaction
    const toggleRecording = async () => {
        if (isRecording) {
            setIsRecording(false);
            (window as any).recognitionInstance?.stop();
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            // Explicitly request mic permission first (modern browsers prefer this)
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (err) {
                console.error("Microphone permission denied:", err);
                alert("Please allow microphone access to use this feature.");
                return;
            }

            const recognition = new SpeechRecognition();
            (window as any).recognitionInstance = recognition; // Store instance to stop it later

            recognition.continuous = true; // KEEP RECORDING until stopped
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsRecording(true);
            recognition.onend = () => setIsRecording(false);

            recognition.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setInput(prev => prev + (prev ? ' ' : '') + finalTranscript);
                }
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                if (event.error === 'audio-capture') {
                    // Mute alert if it's just a transient connection issue, but show for persistent
                    console.warn("No mic detected.");
                }
                // Don't separate logic here, let it just stop.
                // setIsRecording(false) handles the UI reset.
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
                    // data:image/png;base64,...
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
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-4 md:p-6 pb-6">

            {/* File Previews */}
            {files.length > 0 && (
                <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide">
                    {files.map((f: any, i) => (
                        <div key={i} className="relative group shrink-0">
                            <div className="w-16 h-16 rounded-lg border border-white/20 overflow-hidden bg-white/5 flex items-center justify-center">
                                {f.mimeType.startsWith('image/') ? (
                                    <img src={f.preview} alt={f.name} className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon size={24} className="text-gray-400" />
                                )}
                            </div>
                            <button
                                onClick={() => removeFile(i)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="glass-panel rounded-2xl p-2 flex items-end gap-2 relative transition-all focus-within:ring-2 focus-within:ring-purple-500/50">

                {/* Attach Button */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5 shrink-0"
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

                {/* Text Input */}
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    className="bg-transparent border-0 text-white placeholder-gray-400 focus:ring-0 flex-1 resize-none py-3 max-h-32 min-h-[44px] scrollbar-hide outline-none"
                    rows={1}
                />

                {/* Right Actions */}
                <div className="flex items-center gap-1 pb-1">
                    {/* Voice Input */}
                    <button
                        className={`p-3 rounded-xl transition-all ${isRecording ? 'text-red-400 bg-red-500/10 animate-pulse' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        onClick={toggleRecording}
                    >
                        <Mic size={20} />
                    </button>

                    {/* Send Button */}
                    <button
                        onClick={handleSend}
                        disabled={(!input.trim() && files.length === 0) || isGenerating}
                        className="p-3 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-purple-500/25 transition-all w-11 h-11 flex items-center justify-center"
                    >
                        {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                </div>

            </div>
            <div className="text-center mt-2">
            </div>
        </div>
    );
}
