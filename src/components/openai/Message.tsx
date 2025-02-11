import React from 'react';
import { MessageContent } from './MessageContent';
import { MessageActions } from './MessageActions';
import type { Message as MessageType } from '../../types';

interface MessageProps {
  message: MessageType;
  toolName: string;
  onCopy: () => void;
  onExport: (format: 'text' | 'pdf') => void;
  showExportMenu: boolean;
  setShowExportMenu: (messageId: string | null) => void;
  isCopied: boolean;
}

export function Message({
  message,
  toolName,
  onCopy,
  onExport,
  showExportMenu,
  setShowExportMenu,
  isCopied
}: MessageProps) {
  return (
    <div className="flex justify-between items-start">
      <div className={`${
        message.type === 'user'
          ? 'bg-accent text-white ml-auto max-w-[85%]'
          : 'bg-sage/5 text-primary w-full'
      } rounded-lg relative`}>
        {message.type === 'assistant' && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-sage/10">
            <div className="text-sm text-primary-dark">{toolName}</div>
            <MessageActions
              messageId={message.id}
              onCopy={onCopy}
              onExport={onExport}
              showExportMenu={showExportMenu}
              setShowExportMenu={setShowExportMenu}
              isCopied={isCopied}
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