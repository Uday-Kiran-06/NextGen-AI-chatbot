import { useState, useRef, useEffect, useCallback } from 'react';
import { chatStore } from '@/lib/chat-store';
import { FileAttachment } from '@/components/Chat/types';

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    content: string;
}

interface UseChatProps {
    conversationId: string | null;
    onConversationCreated: (id: string) => void;
    modelId: string;
}

export function useChat({ conversationId, onConversationCreated, modelId }: UseChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [agentAction, setAgentAction] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    
    // Streaming refs
    const pendingContentRef = useRef<string>("");
    const activeMessageIdRef = useRef<string | null>(null);
    const frameIdRef = useRef<number | null>(null);

    // We track every conversationId we created ourselves so the useEffect
    // skips DB-reloads that would wipe in-memory messages during generation.
    const selfCreatedConvoIds = useRef<Set<string>>(new Set());

    // Sync buffer to state via requestAnimationFrame
    const syncBufferToState = useCallback(() => {
        const id = activeMessageIdRef.current;
        const content = pendingContentRef.current;
        if (id && content) {
            setMessages(prev => {
                const idx = prev.findIndex(m => m.id === id);
                if (idx === -1) return prev;
                if (prev[idx].content === content) return prev; // no change
                const next = [...prev];
                next[idx] = { ...next[idx], content };
                return next;
            });
        }
        frameIdRef.current = requestAnimationFrame(syncBufferToState);
    }, []);

    // Cleanup frame on unmount
    useEffect(() => {
        return () => {
            if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
        };
    }, []);

    const handleStopGeneration = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    // Load messages when conversationId changes (e.g. user clicks a sidebar item)
    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            return;
        }

        // If WE just created this conversation, skip the DB reload.
        // Our in-memory messages are the source of truth.
        if (selfCreatedConvoIds.current.has(conversationId)) {
            return;
        }

        // External navigation (user clicked a different conversation in sidebar)
        const loadMessages = async () => {
            const dbMessages = await chatStore.getMessages(conversationId);
            setMessages(dbMessages.map(m => ({
                id: m.id,
                role: m.role as 'user' | 'model',
                content: m.content
            })));
        };
        loadMessages();
    }, [conversationId]);

    const generateAIResponse = useCallback(async (
        history: ChatMessage[],
        userInput: string,
        files: FileAttachment[] = [],
        useWebSearch: boolean = false
    ) => {
        setIsGenerating(true);
        let currentConvoId = conversationId;

        // --- New Conversation Creation ---
        if (!currentConvoId) {
            const shortTitle = userInput.slice(0, 30) + (userInput.length > 30 ? '...' : '');
            const newConvo = await chatStore.createConversation(shortTitle);
            if (newConvo) {
                currentConvoId = newConvo.id;
                await chatStore.addMessage(currentConvoId, 'user', userInput);

                // Mark this ID so useEffect won't reload from DB
                selfCreatedConvoIds.current.add(newConvo.id);
                onConversationCreated(newConvo.id);

                // Fire and forget smart title generation
                fetch('/api/generate-title', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userInput, modelId })
                }).then(res => res.json()).then(data => {
                    if (data.title && currentConvoId) {
                        chatStore.renameConversation(currentConvoId, data.title);
                    }
                }).catch(err => console.error("Failed to generate title:", err));
            }
        }

        // --- /image Command ---
        if (userInput.trim().toLowerCase().startsWith('/image')) {
            try {
                const prompt = userInput.replace(/^\/image\s*/i, '').trim() || "random abstract art";
                let imageUrl = '';
                try {
                    const response = await fetch('/api/image', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt })
                    });
                    if (!response.ok) throw new Error(`API Error (${response.status})`);
                    const data = await response.json();
                    imageUrl = data.imageUrl;
                } catch (apiError) {
                    const encodedPrompt = encodeURIComponent(prompt.slice(0, 500));
                    const seed = Math.floor(Math.random() * 1000000);
                    imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true`;
                }
                if (!imageUrl) throw new Error('Failed to generate image URL');
                const content = `![Generated Image](${imageUrl})\n\n_Generated via direct command: "${prompt}"_`;
                const id = crypto.randomUUID();
                setMessages(prev => [...prev, { id, role: 'model', content }]);
                if (currentConvoId) chatStore.addMessage(currentConvoId, 'model', content);
            } catch (err) {
                setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', content: 'Sorry, I encountered an error generating the image.' }]);
            } finally {
                setIsGenerating(false);
            }
            return;
        }

        // --- Streaming AI Response ---
        const aiMsgId = crypto.randomUUID();
        activeMessageIdRef.current = aiMsgId;
        pendingContentRef.current = "";
        let finalContent = '';

        // Add empty model bubble
        setMessages(prev => [...prev, { id: aiMsgId, role: 'model', content: '' }]);

        try {
            abortControllerRef.current = new AbortController();

            if (files.length > 0) setAgentAction("Analyzing documents...");

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history,
                    message: userInput,
                    layers: files,
                    persona: localStorage.getItem('nextgen_persona') || 'Standard AI',
                    modelId,
                    useWebSearch,
                    rulesEnabled: localStorage.getItem('nextgen_rules_enabled') !== 'false'
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorData;
                try { errorData = JSON.parse(errorText); } catch (e) {
                    throw new Error(`Server Error (${response.status}): ${response.statusText}`);
                }
                throw new Error(errorData.error || 'Network response was not ok');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) throw new Error('No reader available');

            // Start rendering loop
            frameIdRef.current = requestAnimationFrame(syncBufferToState);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const textChunk = decoder.decode(value, { stream: true });
                const lines = textChunk.split('\n');

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    if (line.startsWith('__AGENT_ACTION__:')) {
                        setAgentAction(line.replace('__AGENT_ACTION__:', '').trim());
                    } else {
                        if (line.trim()) setAgentAction(null);
                        const chunk = line + (i < lines.length - 1 ? '\n' : '');
                        pendingContentRef.current += chunk;
                    }
                }
            }

            finalContent = pendingContentRef.current;

        } catch (error: any) {
            if (error.name === 'AbortError') {
                finalContent = pendingContentRef.current;
                if (currentConvoId && finalContent) {
                    chatStore.addMessage(currentConvoId, 'model', finalContent + '\n\n_[Stopped by User]_');
                }
                setMessages(prev => prev.map(msg =>
                    msg.id === aiMsgId ? { ...msg, content: finalContent + '\n\n_[Stopped by User]_' } : msg
                ));
                return;
            }
            console.error('Error generating response:', error);
            finalContent = `Error: ${error.message || 'An unexpected error occurred.'}`;
        } finally {
            // Stop rendering loop
            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current);
                frameIdRef.current = null;
            }

            // Final definitive state update — this is the ONE place we commit content
            setMessages(prev => prev.map(msg =>
                msg.id === aiMsgId ? { ...msg, content: finalContent } : msg
            ));

            // Save to DB ONCE
            if (currentConvoId && finalContent && !finalContent.startsWith('Error:')) {
                chatStore.addMessage(currentConvoId, 'model', finalContent);
            }

            setIsGenerating(false);
            setAgentAction(null);
            activeMessageIdRef.current = null;
            abortControllerRef.current = null;
        }
    }, [conversationId, modelId, onConversationCreated, syncBufferToState]);

    const handleSendMessage = useCallback(async (text: string, files: FileAttachment[], useWebSearch: boolean = false) => {
        const tempId = crypto.randomUUID();
        let messageContent = '';
        const imageFiles = files.filter(f => f.mimeType.startsWith('image/'));
        const otherFiles = files.filter(f => !f.mimeType.startsWith('image/'));

        if (imageFiles.length > 0) {
            imageFiles.forEach(file => { messageContent += `![Image](${file.preview})\n\n`; });
        }
        if (text.trim()) messageContent += text.trim();
        if (otherFiles.length > 0) {
            if (messageContent) messageContent += '\n\n';
            messageContent += `*Attached ${otherFiles.length} other file(s)*`;
        }

        const userChatMessage: ChatMessage = { id: tempId, role: 'user', content: messageContent };
        const currentHistory = [...messages];
        setMessages([...currentHistory, userChatMessage]);

        if (conversationId) {
            chatStore.addMessage(conversationId, 'user', userChatMessage.content);
        }

        if (otherFiles.length > 0) {
            setIsGenerating(true);
            try {
                for (const file of otherFiles) {
                    const uploadRes = await fetch('/api/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            fileName: file.name,
                            mimeType: file.mimeType,
                            fileData: file.data,
                            conversationId
                        })
                    });
                    if (!uploadRes.ok) throw new Error(`Failed to process ${file.name}`);
                }
            } catch (err: any) {
                setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', content: `❌ Error uploading document: ${err.message}` }]);
                setIsGenerating(false);
                return;
            }
        }

        generateAIResponse(currentHistory, userChatMessage.content, imageFiles, useWebSearch);
    }, [messages, conversationId, generateAIResponse]);

    const handleEditMessage = useCallback(async (id: string, newContent: string) => {
        const messageIndex = messages.findIndex(m => m.id === id);
        if (messageIndex === -1) return;

        const messagesToDelete = messages.slice(messageIndex + 1).map(m => m.id);
        const truncatedHistory = messages.slice(0, messageIndex);
        const updatedChatMessage = { ...messages[messageIndex], content: newContent };

        setMessages([...truncatedHistory, updatedChatMessage]);

        if (conversationId) {
            chatStore.updateMessage(id, newContent);
            if (messagesToDelete.length > 0) chatStore.deleteMessages(messagesToDelete);
        }

        generateAIResponse(truncatedHistory, newContent, []);
    }, [messages, conversationId, generateAIResponse]);

    const handleRegenerate = useCallback(async () => {
        if (messages.length < 2) return;

        let lastUserIdx = -1;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === 'user') { lastUserIdx = i; break; }
        }
        if (lastUserIdx === -1) return;

        const messagesToDelete = messages.slice(lastUserIdx + 1).map(m => m.id);
        const truncatedHistory = messages.slice(0, lastUserIdx);
        const lastUserInput = messages[lastUserIdx].content;

        if (conversationId && messagesToDelete.length > 0) {
            chatStore.deleteMessages(messagesToDelete);
        }

        setMessages(messages.slice(0, lastUserIdx + 1));
        generateAIResponse(truncatedHistory, lastUserInput, []);
    }, [messages, conversationId, generateAIResponse]);

    return {
        messages,
        isGenerating,
        agentAction,
        handleSendMessage,
        handleEditMessage,
        handleRegenerate,
        handleStopGeneration
    };
}
