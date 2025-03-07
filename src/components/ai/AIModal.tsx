import { X } from 'lucide-react';
import type { Tool } from '../../types';
import { Message } from './Message.tsx';
import { MessageInput } from './MessageInput.tsx';
import { LoadingIndicator } from './LoadingIndicator.tsx';
import { useAIModal } from '../../hooks/useAIModal.ts';
import { useMessageExport } from '../../hooks/useMessageExport.ts';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  response: string | null;
  onSendFollowUp: (prompt: string) => Promise<void>;
  tool: Tool;
}

export function AIModal({
  isOpen,
  onClose,
  response,
  onSendFollowUp,
  tool
}: AIModalProps) {
  const {
    followUpPrompt,
    setFollowUpPrompt,
    isLoading,
    messages,
    showExportMenu,
    setShowExportMenu,
    copiedMessageId,
    chatContainerRef,
    handleSubmit
  } = useAIModal(response, onSendFollowUp, tool);

  const {
    handleCopyMessage,
    handleExport
  } = useMessageExport();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-5xl h-[90vh] flex flex-col border border-sage/10">
          <div className="flex justify-between items-center p-6 border-b border-sage/10">
            <h3 className="text-xl font-semibold text-primary-dark">{tool.name}</h3>
            <button onClick={onClose} className="text-primary hover:text-primary-dark">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={chatContainerRef}>
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                toolName={tool.name}
                onCopy={() => handleCopyMessage(message.content, message.id)}
                onExport={(format) => handleExport(message.content, format)}
                showExportMenu={showExportMenu === message.id}
                setShowExportMenu={setShowExportMenu}
                isCopied={copiedMessageId === message.id}
              />
            ))}
            {isLoading && <LoadingIndicator />}
          </div>

          <MessageInput
            value={followUpPrompt}
            onChange={setFollowUpPrompt}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}