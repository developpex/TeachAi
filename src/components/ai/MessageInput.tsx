import React from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

export function MessageInput({
                                 value,
                                 onChange,
                                 onSubmit,
                                 isLoading
                             }: MessageInputProps) {
    return (
        <form onSubmit={onSubmit} className="flex space-x-4 w-full">
      <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit(e);
              }
          }}
          rows={1}
          className="flex-1 px-4 py-3 border-2 border-sage/30 dark:border-dark-border rounded-lg rounded-b-lg text-primary-dark dark:text-dark-text placeholder-primary/50 dark:placeholder-dark-text-secondary/50 focus:outline-none focus:ring-accent focus:border-accent resize-none bg-white dark:bg-dark-surface"
          placeholder="Type your message..."
      />
            <button
                type="submit"
                disabled={isLoading || !value.trim()}
                className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg rounded-b-lg hover:bg-accent-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Send className="h-4 w-4" />
            </button>
        </form>
    );
}