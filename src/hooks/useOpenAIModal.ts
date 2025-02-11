import { useState, useRef, useEffect, useCallback } from 'react';
import type { OpenAIResponse, Tool } from '../types';
import { OpenAIService } from '../services/openai';

export function useOpenAIModal(
  response: OpenAIResponse | null,
  onSendFollowUp: (prompt: string) => Promise<void>,
  tool: Tool
) {
  const [followUpPrompt, setFollowUpPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showExportMenu, setShowExportMenu] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const typingSpeedRef = useRef<number>(5);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const addMessage = useCallback((message: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...message, id: Math.random().toString(36).slice(2) }]);
  }, []);

  const updateMessageContent = useCallback((messageId: string, content: string, isTyping: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content, isTyping }
        : msg
    ));
  }, []);

  useEffect(() => {
    if (!response) {
      setMessages([]);
      setIsLoading(true);
    } else if (response?.choices[0]?.message?.content) {
      const newContent = response.choices[0].message.content;
      
      addMessage({
        type: 'assistant',
        content: '',
        fullContent: newContent,
        isTyping: true
      });
      
      setIsLoading(false);
    }
  }, [response, addMessage]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    
    if (!lastMessage?.isTyping || !lastMessage.fullContent) return;

    const fullContent = lastMessage.fullContent;
    const currentContent = lastMessage.content;
    
    if (currentContent.length >= fullContent.length) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const nextChar = fullContent[currentContent.length];
    const delay = ['.', '!', '?', '\n'].includes(nextChar) 
      ? typingSpeedRef.current * 4
      : [',', ';', ':'].includes(nextChar)
        ? typingSpeedRef.current * 2
        : typingSpeedRef.current;

    typingTimeoutRef.current = setTimeout(() => {
      const charsToAdd = 3;
      const newContent = fullContent.slice(0, Math.min(currentContent.length + charsToAdd, fullContent.length));
      updateMessageContent(
        lastMessage.id,
        newContent,
        newContent.length < fullContent.length
      );
    }, delay);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [messages, updateMessageContent]);

  // Auto-scroll to bottom whenever messages change or content is typed
  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPrompt = followUpPrompt.trim();
    if (!trimmedPrompt) return;

    addMessage({ type: 'user', content: trimmedPrompt });
    setIsLoading(true);
    setFollowUpPrompt('');
    
    try {
      await onSendFollowUp(trimmedPrompt);
    } catch (error) {
      console.error('Error sending follow-up:', error);
      setIsLoading(false);
    }
  };

  return {
    followUpPrompt,
    setFollowUpPrompt,
    isLoading,
    messages,
    showExportMenu,
    setShowExportMenu,
    copiedMessageId,
    setCopiedMessageId,
    chatContainerRef,
    handleSubmit
  };
}