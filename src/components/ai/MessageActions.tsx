import { Copy, Check, Download, FileText, File, Heart } from 'lucide-react';

interface MessageActionsProps {
  messageId: string;
  onCopy: () => void;
  onExport: (format: 'text' | 'pdf') => void;
  onFavorite?: () => void;
  showExportMenu: boolean;
  setShowExportMenu: (messageId: string | null) => void;
  copiedMessageId: string | null;
  isFavorite?: boolean;
}

export function MessageActions({
  messageId,
  onCopy,
  onExport,
  onFavorite,
  showExportMenu,
  setShowExportMenu,
  copiedMessageId,
  isFavorite
}: MessageActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onCopy}
        className="p-1.5 hover:bg-sage/10 dark:hover:bg-dark-surface rounded-lg transition-colors duration-200 group"
        title="Copy to clipboard"
      >
        {copiedMessageId === messageId ? (
          <Check className="h-4 w-4 text-mint" />
        ) : (
          <Copy className="h-4 w-4 text-primary dark:text-dark-text-secondary group-hover:text-primary-dark dark:group-hover:text-dark-text" />
        )}
      </button>

      <div className="relative">
        <button
          onClick={() => setShowExportMenu(showExportMenu ? null : messageId)}
          className="p-1.5 hover:bg-sage/10 dark:hover:bg-dark-surface rounded-lg transition-colors duration-200 group"
          title="Export response"
        >
          <Download className="h-4 w-4 text-primary dark:text-dark-text-secondary group-hover:text-primary-dark dark:group-hover:text-dark-text" />
        </button>
        {showExportMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-nav rounded-lg shadow-lg dark:shadow-dark-soft border border-sage/10 dark:border-dark-border py-2 z-10">
            <button
              onClick={() => onExport('text')}
              className="w-full px-4 py-2 text-left text-sm text-primary dark:text-dark-text hover:bg-sage/10 dark:hover:bg-dark-surface flex items-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export as Text
            </button>
            <button
              onClick={() => onExport('pdf')}
              className="w-full px-4 py-2 text-left text-sm text-primary dark:text-dark-text hover:bg-sage/10 dark:hover:bg-dark-surface flex items-center"
            >
              <File className="h-4 w-4 mr-2" />
              Export as PDF
            </button>
          </div>
        )}
      </div>

      {onFavorite && (
        <button
          onClick={onFavorite}
          className="p-1.5 hover:bg-sage/10 dark:hover:bg-dark-surface rounded-lg transition-colors duration-200 group"
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={`h-4 w-4 ${
              isFavorite 
                ? 'text-accent fill-current' 
                : 'text-primary dark:text-dark-text-secondary group-hover:text-primary-dark dark:group-hover:text-dark-text'
            }`} 
          />
        </button>
      )}
    </div>
  );
}