import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { vibrate } from '@/lib/utils';

interface UseSpeechRecognitionProps {
    onResult: (result: string) => void;
    onSilence?: () => void;
}

export function useSpeechRecognition({ onResult, onSilence }: UseSpeechRecognitionProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && (window as any).recognitionInstance) {
                (window as any).recognitionInstance.stop();
            }
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };
    }, []);

    const stopRecording = () => {
        setIsRecording(false);
        setInterimTranscript('');
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
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
        if (!SpeechRecognition) {
            toast.error("Speech recognition not supported in this browser.");
            return;
        }

        try {
            // Request permission once clearly before starting recognition
            // This satisfies the user-gesture requirement on many mobile browsers
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Immediately stop the stream as we only needed it for permission
            // The SpeechRecognition API will manage its own audio stream
            stream.getTracks().forEach(track => track.stop());
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

            // Continuous Mode Silence Detection
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            if (onSilence) {
                silenceTimerRef.current = setTimeout(() => {
                    onSilence();
                }, 2500); // Trigger send after 2.5s of silence
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            // On mobile, 'aborted' or 'not-allowed' are common
            if (event.error === 'not-allowed') {
                toast.error("Microphone access blocked.");
            } else if (event.error === 'no-speech') {
                // Ignore no-speech errors to prevent UI flickering on mobile
            } else {
                toast.error(`Error: ${event.error}`);
            }
            setIsRecording(false);
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };

        try {
            recognition.start();
        } catch (e) {
            console.error("Failed to start recognition:", e);
        }
    };

    return {
        isRecording,
        interimTranscript,
        toggleRecording,
        stopRecording
    };
}
