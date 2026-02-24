import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { vibrate } from '@/lib/utils';

interface UseSpeechRecognitionProps {
    onResult: (result: string) => void;
}

export function useSpeechRecognition({ onResult }: UseSpeechRecognitionProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');

    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && (window as any).recognitionInstance) {
                (window as any).recognitionInstance.stop();
            }
        };
    }, []);

    const stopRecording = () => {
        setIsRecording(false);
        setInterimTranscript('');
        if (typeof window !== 'undefined' && (window as any).recognitionInstance) {
            (window as any).recognitionInstance.stop();
        }
    };

    const toggleRecording = async () => {
        if (isRecording) {
            stopRecording();
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
                    onResult(finalTranscript);
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

    return {
        isRecording,
        interimTranscript,
        toggleRecording,
        stopRecording
    };
}
