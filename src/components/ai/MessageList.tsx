import { Message } from './Message.tsx';
import type { Message as MessageType } from '../../types';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
  toolName: string;
  onCopyMessage: (messageId: string) => void;
  onExport: (messageId: string, format: 'text' | 'pdf') => void;
  showExportMenu: string | null;
  setShowExportMenu: (messageId: string | null) => void;
  copiedMessageId: string | null;
}

export function MessageList({
  messages,
  isLoading,
  toolName,
  onCopyMessage,
  onExport,
  showExportMenu,
  setShowExportMenu,
  copiedMessageId
}: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          toolName={toolName}
          onCopy={() => onCopyMessage(message.id)}
          onExport={(format) => onExport(message.id, format)}
          showExportMenu={showExportMenu === message.id}
          setShowExportMenu={setShowExportMenu}
          isCopied={copiedMessageId === message.id}
        />
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="inline-flex bg-sage/5 text-primary rounded-lg px-4 py-2">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-100" />
              <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}