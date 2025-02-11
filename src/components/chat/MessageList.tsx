import React, { useEffect } from 'react';
import { Message } from './Message';
import type { ChatMessage } from '../../types';

interface MessageListProps {
  messages: ChatMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function MessageList({ messages, messagesEndRef }: MessageListProps) {
  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}