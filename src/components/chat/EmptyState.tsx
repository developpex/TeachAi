import { Hash } from 'lucide-react';
import type { Channel } from '../../types';

interface EmptyStateProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
}

export function EmptyState({ channels, onChannelSelect }: EmptyStateProps) {
  const handleStartChat = () => {
    if (channels.length > 0) {
      onChannelSelect(channels[0]);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-sage/5 dark:bg-dark-surface p-4">
      <div className="text-center">
        <Hash className="h-12 w-12 text-primary/40 dark:text-dark-text-secondary/40 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-primary-dark dark:text-dark-text mb-2">
          Welcome to TeachAI Chat
        </h3>
        <p className="text-primary dark:text-dark-text-secondary mb-6">
          Join the conversation with other teachers
        </p>
        <button
          onClick={handleStartChat}
          className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 shadow-soft dark:shadow-dark-soft"
        >
          Start Chatting
        </button>
      </div>
    </div>
  );
}