import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { vibrate } from '@/lib/utils';

interface UseSpeechRecognitionProps {
    onResult: (result: string) => void;
    onSilence?: () => void;
}

export function useSpeechRecognition({ onResult, onSilence }: UseSpeechRecognitionProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    
    // Media Recording Refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                if (audioBlob.size > 1000) { // Only send if at least 1KB
                    await transcribeAudio(audioBlob);
                }
                
                // Cleanup stream
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            vibrate(20);
            
            // Initial silence detection start if provided
            resetSilenceTimer();
            setInterimTranscript("Recording...");

        } catch (err) {
            console.error("Microphone access failed:", err);
            toast.error("Could not access microphone.");
        }
    };

    const transcribeAudio = async (blob: Blob) => {
        setIsProcessing(true);
        setInterimTranscript("Transcribing...");
        try {
            const formData = new FormData();
            formData.append('file', blob);

            const response = await fetch('/api/whisper', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error("Transcription failed");
            
            const data = await response.json();
            if (data.text && data.text.length > 1) {
                onResult(data.text);
            }
        } catch (err) {
            console.error("Whisper Error:", err);
            toast.error("Voice transcription failed.");
        } finally {
            setIsProcessing(false);
            setInterimTranscript("");
        }
    };

    const resetSilenceTimer = () => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (onSilence && isRecording) {
            silenceTimerRef.current = setTimeout(() => {
                stopRecording();
                onSilence();
            }, 3000); // 3 seconds of silence to auto-send
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    return {
        isRecording,
        isProcessing,
        interimTranscript,
        toggleRecording,
        stopRecording
    };
}
