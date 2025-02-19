import { MessageContent } from './MessageContent.tsx';
import { MessageActions } from './MessageActions.tsx';
import type { ChatMessage as MessageType } from '../../types';

interface MessageProps {
  message: MessageType;
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
          <MessageContent
            type={message.type}
            content={message.content}
          />
        </div>
      </div>
    </div>
  );
}