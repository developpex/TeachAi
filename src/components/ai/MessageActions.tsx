import { Copy, Check, Download, FileText, File } from 'lucide-react';

interface MessageActionsProps {
  messageId: string;
  onCopy: () => void;
  onExport: (format: 'text' | 'pdf') => void;
  showExportMenu: boolean;
  setShowExportMenu: (messageId: string | null) => void;
  isCopied: boolean;
}

export function MessageActions({
  messageId,
  onCopy,
  onExport,
  showExportMenu,
  setShowExportMenu,
  isCopied
}: MessageActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onCopy}
        className="p-1.5 hover:bg-sage/10 rounded-lg transition-colors duration-200"
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-mint" />
        ) : (
          <Copy className="h-4 w-4 text-primary" />
        )}
      </button>
      <div className="relative">
        <button
          onClick={() => setShowExportMenu(showExportMenu ? null : messageId)}
          className="p-1.5 hover:bg-sage/10 rounded-lg transition-colors duration-200"
        >
          <Download className="h-4 w-4 text-primary" />
        </button>
        {showExportMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-sage/10 py-2 z-10">
            <button
              onClick={() => onExport('text')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-sage/10 flex items-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export as Text
            </button>
            <button
              onClick={() => onExport('pdf')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-sage/10 flex items-center"
            >
              <File className="h-4 w-4 mr-2" />
              Export as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}