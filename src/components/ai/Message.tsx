import { MessageContent } from './MessageContent.tsx';
import { MessageActions } from './MessageActions.tsx';
import type { ChatMessage as MessageType } from '../../types';
import { LoadingIndicator } from './LoadingIndicator';
import { AlertTriangle } from 'lucide-react';

interface MessageProps {
  message: MessageType & { isLoading?: boolean; isError?: boolean };
  toolName: string;
  onCopy: () => void;
  onExport: (format: 'text' | 'pdf') => void;
  onFavorite?: () => void;
  showExportMenu: boolean;
  setShowExportMenu: (messageId: string | null) => void;
  isCopied: boolean;
  isFavorite?: boolean;
}

export function Message({
  message,
  toolName,
  onCopy,
  onExport,
  onFavorite,
  showExportMenu,
  setShowExportMenu,
  isCopied,
  isFavorite
}: MessageProps) {
  return (
    <div className="flex justify-between items-start">
      <div className={`${
        message.type === 'user'
          ? 'bg-accent text-white ml-auto max-w-[85%]'
          : 'bg-sage/5 dark:bg-dark-surface text-primary dark:text-dark-text w-full'
      } rounded-lg relative`}>
        {message.type === 'assistant' && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-sage/10 dark:border-dark-border">
            <div className="text-sm text-primary-dark dark:text-dark-text">{toolName}</div>
            <MessageActions
              messageId={message.id}
              onCopy={onCopy}
              onExport={onExport}
              onFavorite={onFavorite}
              showExportMenu={showExportMenu}
              setShowExportMenu={setShowExportMenu}
              copiedMessageId={isCopied ? message.id : null}
              isFavorite={isFavorite}
            />
          </div>
        )}
        <div className="p-4">
          {message.isLoading ? (
            <div className="flex items-center space-x-3">
              <p className="text-primary dark:text-dark-text">{message.content}</p>
              <LoadingIndicator />
            </div>
          ) : message.isError ? (
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-primary dark:text-dark-text">{message.content}</p>
            </div>
          ) : (
            <MessageContent
              type={message.type}
              content={message.content}
            />
          )}
        </div>
      </div>
    </div>
  );
}