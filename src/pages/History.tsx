import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trash2, Heart, ChevronDown, ChevronUp, HelpCircle, Search, Pencil, Save, X, Copy, Download, Check, FileText, File } from 'lucide-react';
import { HistoryService, SavedResponse } from '../services/history';
import { getIconComponent } from '../utils/icons';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTools } from '../hooks/useTools';
import { HistoryHeader } from '../components/history/HistoryHeader';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { useMessageExport } from '../hooks/useMessageExport';

export function History() {
  const [responses, setResponses] = useState<SavedResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTools, setExpandedTools] = useState<Record<string, boolean>>({});
  const [expandedResponses, setExpandedResponses] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const historyService = HistoryService.getInstance();
  const { tools, loading: toolsLoading } = useTools({ filterByCategory: false });
  const { showExportMenu, setShowExportMenu, copiedMessageId, handleCopyMessage, handleExport } = useMessageExport();

  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = async () => {
    try {
      setLoading(true);
      const savedResponses = await historyService.getSavedResponses();

      const sorted = savedResponses.sort((a, b) =>
          b.savedAt.getTime() - a.savedAt.getTime()
      );

      setResponses(sorted);

      const initialExpandedState = sorted.reduce((acc, response) => {
        if (response.toolId) {
          acc[response.toolId] = true;
        }
        return acc;
      }, {} as Record<string, boolean>);
      setExpandedTools(initialExpandedState);

      setError(null);
    } catch (err) {
      console.error('Error loading responses:', err);
      setError('Failed to load saved responses');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (responseId: string) => {
    try {
      await historyService.removeResponse(responseId);
      setResponses(prev => prev.filter(r => r.id !== responseId));
    } catch (err) {
      console.error('Error removing response:', err);
      setError('Failed to remove response');
    }
  };

  const handleUpdateTitle = async (responseId: string) => {
    if (!newTitle.trim()) return;

    try {
      await historyService.updateResponseTitle(responseId, newTitle.trim());
      setResponses(prev => prev.map(response =>
          response.id === responseId
              ? { ...response, title: newTitle.trim() }
              : response
      ));
      setEditingTitle(null);
      setNewTitle('');
    } catch (err) {
      console.error('Error updating title:', err);
      setError('Failed to update title');
    }
  };

  const toggleTool = (toolId: string) => {
    setExpandedTools(prev => ({
      ...prev,
      [toolId]: !prev[toolId]
    }));
  };

  const toggleResponse = (responseId: string) => {
    setExpandedResponses(prev => ({
      ...prev,
      [responseId]: !prev[responseId]
    }));
  };

  const filteredResponses = responses.filter(response => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const title = response.title?.toLowerCase() || '';
    const content = response.content?.toLowerCase() || '';
    const toolName = response.toolName?.toLowerCase() || '';

    return (
        title.includes(query) ||
        content.includes(query) ||
        toolName.includes(query)
    );
  });

  const groupedResponses = filteredResponses.reduce((acc, response) => {
    if (response.toolId) {
      if (!acc[response.toolId]) {
        acc[response.toolId] = [];
      }
      acc[response.toolId].push(response);
    }
    return acc;
  }, {} as Record<string, SavedResponse[]>);

  if (loading || toolsLoading) {
    return (
        <div className="min-h-screen bg-background dark:bg-dark-background flex items-center justify-center">
          <LoadingSpinner />
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-background dark:bg-dark-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HistoryHeader />

          <div className="mb-8 flex justify-center">
            <div className="relative w-full max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/60 dark:text-dark-text-secondary" />
              <input
                  type="text"
                  placeholder="Search saved responses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-nav border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text placeholder-primary/50 dark:placeholder-dark-text-secondary/50 focus:outline-none focus:ring-accent focus:border-accent"
              />
            </div>
          </div>

          {error && (
              <div className="mb-8 p-4 bg-coral/20 dark:bg-coral/10 border border-accent rounded-lg text-accent-dark">
                {error}
              </div>
          )}

          {Object.entries(groupedResponses).length === 0 ? (
              <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8 text-center">
                <Heart className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-primary-dark dark:text-dark-text mb-2">
                  {searchQuery ? 'No matching responses found' : 'No saved responses yet'}
                </h3>
                <p className="text-primary dark:text-dark-text-secondary mb-6">
                  {searchQuery
                      ? 'Try adjusting your search terms'
                      : 'Save your favorite AI responses by clicking the heart icon'}
                </p>
                {!searchQuery && (
                    <Link
                        to="/tools"
                        className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300"
                    >
                      Explore Tools
                    </Link>
                )}
              </div>
          ) : (
              <div className="space-y-8">
                {Object.entries(groupedResponses).map(([toolId, toolResponses]) => {
                  const tool = tools.find(t => t.id === toolId);
                  const IconComponent = tool ? getIconComponent(tool.icon) : HelpCircle;
                  const isExpanded = expandedTools[toolId];

                  return (
                      <div key={toolId} className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border overflow-hidden">
                        <button
                            onClick={() => toggleTool(toolId)}
                            className="w-full p-6 border-b border-sage/10 dark:border-dark-border flex items-center justify-between hover:bg-sage/5 dark:hover:bg-dark-surface transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-accent/10 dark:bg-accent/20 rounded-lg">
                              <IconComponent className="h-5 w-5 text-accent" />
                            </div>
                            <div className="text-left">
                              <h2 className="text-lg font-semibold text-primary-dark dark:text-dark-text">
                                {toolResponses[0].toolName}
                              </h2>
                              <p className="text-sm text-primary dark:text-dark-text-secondary">
                                {toolResponses.length} saved {toolResponses.length === 1 ? 'response' : 'responses'}
                              </p>
                            </div>
                          </div>
                          {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-primary dark:text-dark-text" />
                          ) : (
                              <ChevronDown className="h-5 w-5 text-primary dark:text-dark-text" />
                          )}
                        </button>

                        {isExpanded && (
                            <div className="divide-y divide-sage/10 dark:divide-dark-border">
                              {toolResponses.map((response) => (
                                  <div key={response.id} className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                      <div className="flex-1 mr-4">
                                        {editingTitle === response.id ? (
                                            <div className="flex items-center space-x-2">
                                              <input
                                                  type="text"
                                                  value={newTitle}
                                                  onChange={(e) => setNewTitle(e.target.value)}
                                                  className="flex-1 px-3 py-1 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text focus:outline-none focus:ring-accent focus:border-accent dark:bg-dark-surface"
                                                  placeholder="Enter title..."
                                              />
                                              <button
                                                  onClick={() => handleUpdateTitle(response.id)}
                                                  className="p-1.5 text-mint hover:text-primary dark:text-mint dark:hover:text-dark-text transition-colors duration-200"
                                              >
                                                <Save className="h-4 w-4" />
                                              </button>
                                              <button
                                                  onClick={() => {
                                                    setEditingTitle(null);
                                                    setNewTitle('');
                                                  }}
                                                  className="p-1.5 text-accent hover:text-accent-dark transition-colors duration-200"
                                              >
                                                <X className="h-4 w-4" />
                                              </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                              <button
                                                  onClick={() => toggleResponse(response.id)}
                                                  className="flex items-center space-x-2 text-primary-dark dark:text-dark-text hover:text-accent dark:hover:text-accent transition-colors duration-200"
                                              >
                                                {expandedResponses[response.id] ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )}
                                                <h3 className="text-lg font-medium">
                                                  {response.title}
                                                </h3>
                                              </button>
                                              <button
                                                  onClick={() => {
                                                    setEditingTitle(response.id);
                                                    setNewTitle(response.title);
                                                  }}
                                                  className="p-1.5 text-primary dark:text-dark-text-secondary hover:text-primary-dark dark:hover:text-dark-text transition-colors duration-200"
                                              >
                                                <Pencil className="h-4 w-4" />
                                              </button>
                                            </div>
                                        )}
                                        <div className="flex items-center space-x-2 text-sm text-primary dark:text-dark-text-secondary mt-1">
                                          <Clock className="h-4 w-4" />
                                          <span>
                                  Saved {formatDistanceToNow(response.savedAt, { addSuffix: true })}
                                </span>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleCopyMessage(response.content, response.id)}
                                            className="p-1.5 text-primary dark:text-dark-text-secondary hover:text-primary-dark dark:hover:text-dark-text transition-colors duration-200"
                                            title="Copy to clipboard"
                                        >
                                          {copiedMessageId === response.id ? (
                                              <Check className="h-4 w-4 text-mint" />
                                          ) : (
                                              <Copy className="h-4 w-4" />
                                          )}
                                        </button>
                                        <div className="relative">
                                          <button
                                              onClick={() => setShowExportMenu(showExportMenu === response.id ? null : response.id)}
                                              className="p-1.5 text-primary dark:text-dark-text-secondary hover:text-primary-dark dark:hover:text-dark-text transition-colors duration-200"
                                              title="Export response"
                                          >
                                            <Download className="h-4 w-4" />
                                          </button>
                                          {showExportMenu === response.id && (
                                              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-nav rounded-lg shadow-lg dark:shadow-dark-soft border border-sage/10 dark:border-dark-border py-2 z-10">
                                                <button
                                                    onClick={() => handleExport(response.content, 'text')}
                                                    className="w-full px-4 py-2 text-left text-sm text-primary dark:text-dark-text hover:bg-sage/10 dark:hover:bg-dark-surface flex items-center"
                                                >
                                                  <FileText className="h-4 w-4 mr-2" />
                                                  Export as Text
                                                </button>
                                                <button
                                                    onClick={() => handleExport(response.content, 'pdf')}
                                                    className="w-full px-4 py-2 text-left text-sm text-primary dark:text-dark-text hover:bg-sage/10 dark:hover:bg-dark-surface flex items-center"
                                                >
                                                  <File className="h-4 w-4 mr-2" />
                                                  Export as PDF
                                                </button>
                                              </div>
                                          )}
                                        </div>
                                        <button
                                            onClick={() => handleRemove(response.id)}
                                            className="p-1.5 text-accent hover:text-accent-dark transition-colors duration-200"
                                            title="Remove from favorites"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>

                                    {expandedResponses[response.id] && (
                                        <div className="bg-sage/5 dark:bg-dark-surface rounded-lg p-6 mt-4">
                                          <div className="prose prose-sm max-w-none markdown-content dark:text-dark-text">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                              {response.content}
                                            </ReactMarkdown>
                                          </div>
                                        </div>
                                    )}
                                  </div>
                              ))}
                            </div>
                        )}
                      </div>
                  );
                })}
              </div>
          )}
        </div>
      </div>
  );
}