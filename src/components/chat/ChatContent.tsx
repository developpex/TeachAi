import { Hash, Menu } from 'lucide-react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { EmptyState } from './EmptyState';
import type { Channel, ChatMessage } from '../../types';

interface ChatContentProps {
  selectedChannel: Channel | null;
  channels: Channel[];
  messages: ChatMessage[];
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onChannelSelect: (channel: Channel) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export function ChatContent({
  selectedChannel,
  channels,
  messages,
  message,
  setMessage,
  onSubmit,
  messagesEndRef,
  onChannelSelect,
  isSidebarOpen,
  setIsSidebarOpen
}: ChatContentProps) {
  if (!selectedChannel) {
    return <EmptyState channels={channels} onChannelSelect={onChannelSelect} />;
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Channel Header */}
      <div className="h-[65px] border-b border-sage/10 dark:border-dark-border px-6 flex items-center justify-between bg-white dark:bg-dark-nav">
        <div className="flex items-center space-x-2">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 -ml-2 hover:bg-sage/10 dark:hover:bg-dark-surface rounded-lg transition-colors duration-200"
          >
            <Menu className="h-5 w-5 text-primary dark:text-dark-text" />
          </button>

          <Hash className="h-5 w-5 text-primary dark:text-dark-text" />
          <div>
            <h2 className="text-lg font-semibold text-primary-dark dark:text-dark-text">
              {selectedChannel.name}
            </h2>
            <p className="text-xs text-primary dark:text-dark-text-secondary">
              {messages.length} messages
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <MessageList
          messages={messages}
          messagesEndRef={messagesEndRef}
        />
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-dark-nav border-t border-sage/10 dark:border-dark-border">
        <MessageInput
          value={message}
          onChange={setMessage}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}