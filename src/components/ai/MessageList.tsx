import { Message } from './Message';
import type { ChatMessage } from '../../types';
import { HistoryService } from '../../services/history';
import { useEffect, useState } from 'react';

interface MessageListProps {
    messages: ChatMessage[];
    isLoading?: boolean;
    toolName: string;
    toolId: string;
    onCopyMessage: (messageId: string) => void;
    onExport: (messageId: string, format: 'text' | 'pdf') => void;
    showExportMenu: string | null;
    setShowExportMenu: (messageId: string | null) => void;
    copiedMessageId: string | null;
}

export function MessageList({
                                messages,
                                toolName,
                                toolId,
                                onCopyMessage,
                                onExport,
                                showExportMenu,
                                setShowExportMenu,
                                copiedMessageId
                            }: MessageListProps) {
    const [savedResponses, setSavedResponses] = useState<string[]>([]);
    const historyService = HistoryService.getInstance();

    useEffect(() => {
        let mounted = true;

        const loadSavedResponses = async () => {
            try {
                const responses = await historyService.getSavedResponses();
                if (mounted) {
                    setSavedResponses(responses.map(r => r.content));
                }
            } catch (error) {
                console.error('Error loading saved responses:', error);
            }
        };

        loadSavedResponses();

        return () => {
            mounted = false;
        };
    }, []);

    const handleFavorite = async (messageId: string) => {
        const message = messages.find(m => m.id === messageId);
        if (!message || message.type !== 'assistant') return;

        try {
            if (savedResponses.includes(message.content)) {
                // Find the response ID and remove it
                const responses = await historyService.getSavedResponses();
                const responseToRemove = responses.find(r => r.content === message.content);
                if (responseToRemove) {
                    await historyService.removeResponse(responseToRemove.id);
                    setSavedResponses(prev => prev.filter(content => content !== message.content));
                }
            } else {
                // Generate a title from the first line or first 50 characters
                const title = message.content.split('\n')[0].slice(0, 50).trim();
                await historyService.saveResponse(
                    toolId,
                    toolName,
                    message.content,
                    title
                );
                setSavedResponses(prev => [...prev, message.content]);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {messages.map((message) => (
                <Message
                    key={message.id}
                    message={message}
                    toolName={toolName}
                    onCopy={() => onCopyMessage(message.id)}
                    onExport={(format) => onExport(message.id, format)}
                    onFavorite={message.type === 'assistant' ? () => handleFavorite(message.id) : undefined}
                    showExportMenu={showExportMenu === message.id}
                    setShowExportMenu={setShowExportMenu}
                    isCopied={copiedMessageId === message.id}
                    isFavorite={message.type === 'assistant' && savedResponses.includes(message.content)}
                />
            ))}
            <div className="h-0" />
        </div>
    );
}