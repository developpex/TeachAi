import { Message } from './Message';
import type { ChatMessage } from '../../types';
import { HistoryService } from '../../services/history';
import { useEffect, useState, useRef } from 'react';

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

    // Auto-scroll related states and ref
    const listRef = useRef<HTMLDivElement>(null);
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

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
    }, [historyService]);

    // Auto-scroll effect: scroll to bottom if auto-scroll is enabled
    useEffect(() => {
        if (listRef.current && isAutoScrollEnabled) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages, isAutoScrollEnabled]);

    // Handle manual scroll: disable auto-scroll if user scrolls away from the bottom
    const handleScroll = () => {
        if (!listRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
        const atBottom = scrollHeight - scrollTop <= clientHeight + 20;
        setIsAutoScrollEnabled(atBottom);
    };

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
        <div
            ref={listRef}
            onScroll={handleScroll}
            className="p-6 space-y-6 overflow-y-auto"
            style={{ maxHeight: '100%' }} // ensure container can scroll
        >
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
