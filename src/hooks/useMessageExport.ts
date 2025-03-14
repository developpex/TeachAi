import { useState } from 'react';
import { jsPDF } from 'jspdf';

export function useMessageExport() {
  const [showExportMenu, setShowExportMenu] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const handleExport = async (content: string, format: 'text' | 'pdf') => {
    try {
      switch (format) {
        case 'text': {
          const blob = new Blob([content], { type: 'text/plain' });
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
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const margin = 15;
          const maxWidth = pageWidth - (margin * 2);
          const lineHeight = 7;

          // Split text into lines that fit the page width
          const lines = pdf.splitTextToSize(content, maxWidth);
          let currentPage = 1;
          let y = margin;

          // Add lines to pages
          for (let i = 0; i < lines.length; i++) {
            // Check if we need a new page
            if (y + lineHeight > pageHeight - margin) {
              pdf.addPage();
              currentPage++;
              y = margin;
            }

            // Add the line
            pdf.text(lines[i], margin, y);
            y += lineHeight;
          }

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