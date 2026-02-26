import { useState, useRef, useEffect } from 'react';
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

    const handleStopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    };

    // Load messages when conversationId changes
    useEffect(() => {
        const loadMessages = async () => {
            if (conversationId) {
                if (isGenerating) return;
                const dbMessages = await chatStore.getMessages(conversationId);
                setMessages(dbMessages.map(m => ({ id: m.id, role: m.role as 'user' | 'model', content: m.content })));
            } else {
                setMessages([]);
            }
        };
        loadMessages();
    }, [conversationId]);

    const generateAIResponse = async (history: ChatMessage[], userInput: string, files: FileAttachment[] = [], useWebSearch: boolean = false) => {
        setIsGenerating(true);
        let currentConvoId = conversationId;

        if (!currentConvoId) {
            const shortTitle = userInput.slice(0, 30) + (userInput.length > 30 ? '...' : '');
            const newConvo = await chatStore.createConversation(shortTitle);
            if (newConvo) {
                currentConvoId = newConvo.id;
                await chatStore.addMessage(currentConvoId, 'user', userInput);
                onConversationCreated(newConvo.id);

                // Fire and forget smart title generation
                fetch('/api/generate-title', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userInput, modelId })
                }).then(res => res.json()).then(data => {
                    if (data.title && currentConvoId) {
                        chatStore.renameConversation(currentConvoId, data.title).then(() => {
                            // This is handled by a refresh event loop in layout, but typically triggers an update implicitly next cycle
                        });
                    }
                }).catch(err => console.error("Failed to generate title:", err));
            }
        }

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

                    if (!response.ok) {
                        const errText = await response.text();
                        throw new Error(`API Error (${response.status}): ${errText}`);
                    }

                    const data = await response.json();
                    imageUrl = data.imageUrl;
                } catch (apiError) {
                    console.error('Secure image generation failed, falling back to client-side:', apiError);
                    const encodedPrompt = encodeURIComponent(prompt.slice(0, 500));
                    const seed = Math.floor(Math.random() * 1000000);
                    const apiKey = process.env.NEXT_PUBLIC_POLLINATIONS_API_KEY || '';
                    const keyParam = apiKey ? `&key=${apiKey}` : '';
                    imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?width=1024&height=1024&seed=${seed}&model=flux&nologo=true${keyParam}`;
                }

                if (!imageUrl) throw new Error('Failed to generate image URL');

                const aiChatMessageContent = `![Generated Image](${imageUrl})\n\n_Generated via direct command: "${prompt}"_`;
                const aiChatMessageId = (Date.now() + 1).toString();
                setMessages(prev => [...prev, { id: aiChatMessageId, role: 'model', content: aiChatMessageContent }]);

                if (currentConvoId) {
                    chatStore.addMessage(currentConvoId, 'model', aiChatMessageContent);
                }
            } catch (err) {
                console.error("Image command failed", err);
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: 'Sorry, I encountered an error generating the image.' }]);
            } finally {
                setIsGenerating(false);
            }
            return;
        }

        let aiChatMessageId = '';
        let aiChatMessageContent = '';

        try {
            abortControllerRef.current = new AbortController();
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history,
                    message: userInput,
                    layers: files,
                    persona: localStorage.getItem('nextgen_persona') || 'Standard AI',
                    modelId,
                    useWebSearch
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    throw new Error(`Server Error (${response.status}): ${response.statusText}`);
                }
                throw new Error(errorData.error || 'Network response was not ok');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No reader available');

            aiChatMessageId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { id: aiChatMessageId, role: 'model', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const textChunk = decoder.decode(value, { stream: true });

                // Process potential multiple lines or concatenated markers in a single buffer
                const lines = textChunk.split('\n');

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];

                    if (line.startsWith('__AGENT_ACTION__:')) {
                        const action = line.replace('__AGENT_ACTION__:', '');
                        setAgentAction(action.trim());
                    } else if (line.trim() || i < lines.length - 1) {
                        // It's a normal text message line (or an empty line between text)
                        // Note: we only clear agent action if we are actually getting content
                        if (line.trim()) setAgentAction(null);

                        // Re-add the newline if it wasn't the last empty split item
                        const contentToAppend = line + (i < lines.length - 1 ? '\n' : '');
                        aiChatMessageContent += contentToAppend;

                        setMessages(prev => prev.map(msg =>
                            msg.id === aiChatMessageId ? { ...msg, content: aiChatMessageContent } : msg
                        ));
                    }
                }
            }

            if (currentConvoId) {
                chatStore.addMessage(currentConvoId, 'model', aiChatMessageContent);
            }

        } catch (error: any) {
            if (error.name === 'AbortError') {
                if (currentConvoId && aiChatMessageContent) {
                    chatStore.addMessage(currentConvoId, 'model', aiChatMessageContent + '\n\n_[Stopped by User]_');
                }
                setMessages(prev => prev.map(msg =>
                    msg.id === aiChatMessageId ? { ...msg, content: aiChatMessageContent + '\n\n_[Stopped by User]_' } : msg
                ));
                return;
            }
            console.error('Error generating response:', error);
            setAgentAction(null);
            const errorChatMessage = error.message || 'Sorry, I encountered an error. Please check your connection or API key.';
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: `Error: ${errorChatMessage}` }]);
        } finally {
            setIsGenerating(false);
            setAgentAction(null);
            abortControllerRef.current = null;
        }
    };

    const handleSendMessage = async (text: string, files: FileAttachment[], useWebSearch: boolean = false) => {
        const tempId = Date.now().toString();
        let messageContent = '';
        const imageFiles = files.filter(f => f.mimeType.startsWith('image/'));
        const otherFiles = files.filter(f => !f.mimeType.startsWith('image/'));

        if (imageFiles.length > 0) {
            imageFiles.forEach(file => {
                messageContent += `![Image](${file.preview})\n\n`;
            });
        }

        if (text.trim()) {
            messageContent += text.trim();
        }

        if (otherFiles.length > 0) {
            if (messageContent) messageContent += '\n\n';
            messageContent += `*Attached ${otherFiles.length} other file(s)*`;
        }

        const userChatMessage: ChatMessage = { id: tempId, role: 'user', content: messageContent };
        const newChatMessages = [...messages, userChatMessage];
        setMessages(newChatMessages);

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
                            conversationId: conversationId
                        })
                    });

                    if (!uploadRes.ok) throw new Error(`Failed to process ${file.name}`);
                }
            } catch (err: any) {
                setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: `❌ Error uploading document: ${err.message}` }]);
                setIsGenerating(false);
                return;
            }
        }

        await generateAIResponse(newChatMessages, userChatMessage.content, imageFiles, useWebSearch);
    };

    const handleEditMessage = async (id: string, newContent: string) => {
        const messageIndex = messages.findIndex(m => m.id === id);
        if (messageIndex === -1) return;

        const messagesToDelete = messages.slice(messageIndex + 1).map(m => m.id);

        const truncatedHistory = messages.slice(0, messageIndex);
        const updatedChatMessage = { ...messages[messageIndex], content: newContent };
        const newChatMessages = [...truncatedHistory, updatedChatMessage];
        setMessages(newChatMessages);

        if (conversationId) {
            await chatStore.updateMessage(id, newContent);
            if (messagesToDelete.length > 0) {
                await chatStore.deleteMessages(messagesToDelete);
            }
        }

        await generateAIResponse(truncatedHistory, newContent, []);
    };

    const handleRegenerate = async () => {
        if (messages.length < 2) return;

        let lastUserChatMessageIndex = -1;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === 'user') {
                lastUserChatMessageIndex = i;
                break;
            }
        }

        if (lastUserChatMessageIndex === -1) return;

        const messagesToDelete = messages.slice(lastUserChatMessageIndex + 1).map(m => m.id);
        const truncatedHistory = messages.slice(0, lastUserChatMessageIndex);
        const lastUserInput = messages[lastUserChatMessageIndex].content;

        setMessages(messages.slice(0, lastUserChatMessageIndex + 1));

        if (conversationId && messagesToDelete.length > 0) {
            await chatStore.deleteMessages(messagesToDelete);
        }

        await generateAIResponse(truncatedHistory, lastUserInput, []);
    };

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
