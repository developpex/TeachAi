import React from 'react';
import { formatTimeAgo } from '../../utils/formatters';
import type { ChatMessage } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface MessageProps {
  message: ChatMessage;
}

export function Message({ message }: MessageProps) {
  const { user } = useAuth();
  const isCurrentUser = message.userId === user?.uid;

  // Get the first letter of the title
  const getAvatarLetter = (displayName: string) => {
    const titleMatch = displayName.match(/^(Ms\.|Mr\.)\s+(\w)/);
    if (titleMatch) {
      return titleMatch[2].toUpperCase(); // Return first letter of the name after title
    }
    return displayName.charAt(0).toUpperCase(); // Fallback to first letter of display name
  };

  return (
    <div className={`flex items-start space-x-3 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className="flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {getAvatarLetter(message.userDisplayName)}
          </span>
        </div>
      </div>
      
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-primary-dark">
            {message.userDisplayName}
          </span>
          <span className="text-xs text-primary">
            {formatTimeAgo(message.createdAt)}
          </span>
        </div>
        
        <div className={`mt-1 px-4 py-2 rounded-lg max-w-lg ${
          isCurrentUser
            ? 'bg-accent text-white'
            : 'bg-sage/10 text-primary-dark'
        }`}>
          {message.content}
        </div>
      </div>
    </div>
  );
}