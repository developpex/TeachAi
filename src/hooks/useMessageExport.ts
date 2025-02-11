import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { formatTextForCopy } from '../utils/formatters';

export function useMessageExport() {
  const [showExportMenu, setShowExportMenu] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      const text = formatTextForCopy(content);
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const handleExport = async (content: string, format: 'text' | 'pdf') => {
    try {
      const formattedText = formatTextForCopy(content);
      
      switch (format) {
        case 'text': {
          const blob = new Blob([formattedText], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'response.txt';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          break;
        }
        case 'pdf': {
          const pdf = new jsPDF();
          const splitText = pdf.splitTextToSize(formattedText, 180);
          pdf.text(splitText, 15, 15);
          pdf.save('response.pdf');
          break;
        }
      }
    } catch (error) {
      console.error('Failed to export message:', error);
    }
    setShowExportMenu(null);
  };

  return {
    showExportMenu,
    setShowExportMenu,
    copiedMessageId,
    handleCopyMessage,
    handleExport
  };
}