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
      <div className="h-16 border-b border-sage/10 px-6 flex items-center justify-between bg-white">
        <div className="flex items-center space-x-2">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 -ml-2 hover:bg-sage/10 rounded-lg transition-colors duration-200"
          >
            <Menu className="h-5 w-5 text-primary" />
          </button>

          <Hash className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-primary-dark">
              {selectedChannel.name}
            </h2>
            <p className="text-xs text-primary">
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
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-sage/10">
        <MessageInput
          value={message}
          onChange={setMessage}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}