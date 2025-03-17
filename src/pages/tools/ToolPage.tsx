import {useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTools } from '../../hooks/useTools';
import { ToolForm } from './components/ToolForm';
import { getIconComponent } from '../../utils/icons';
import { MetaTags } from '../../components/shared/MetaTags';
import { ArrowLeft, X, RefreshCw, AlertTriangle } from 'lucide-react';
import { MessageList } from '../../components/ai/MessageList';
import { MessageInput } from '../../components/ai/MessageInput';
import { useMessageExport } from '../../hooks/useMessageExport';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { APIService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {useAdmin} from "../../hooks/useAdmin.ts";
import {auth} from "../../config/firebase.ts";

export function ToolPage() {
  const { navigation } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { adminService } = useAdmin();
  const { tools, loading: toolsLoading, error } = useTools({ filterByCategory: false });
  const {
    showExportMenu,
    setShowExportMenu,
    copiedMessageId,
    handleCopyMessage,
    handleExport
  } = useMessageExport();

  const [messages, setMessages] = useState<any[]>([]);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [followUpPrompt, setFollowUpPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [showInputModal, setShowInputModal] = useState(true);
  const [formKey, setFormKey] = useState(0);

  const apiService = APIService.getInstance();

  const currentTool = useMemo(() => {
    if (!toolsLoading && navigation && tools.length > 0) {
      const tool = tools.find(t => t.navigation === navigation);
      if (!tool) {
        navigate('/tools');
        return null;
      }
      return tool;
    }
    return null;
  }, [navigation, tools, toolsLoading, navigate]);

  const toolRef = useRef(currentTool);
  useEffect(() => {
    if (currentTool) {
      toolRef.current = currentTool;
    }
  }, [currentTool]);

  useEffect(() => {
    return () => {
      if (toolRef.current && !toolsLoading) {
        handleClearConversation();
      }
    };
  }, [toolsLoading]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (!auth.currentUser) return;

        const userDoc = await adminService.getUserById(auth.currentUser.uid);
        if (!userDoc?.schoolId) {
          return;
        }

        setSchoolId(userDoc.schoolId);

      } catch (err) {
        console.error('Error initializing data:', err);
      }
    };

    initializeData();
  }, [adminService]);

  const handleClearConversation = async () => {
    const tool = toolRef.current;
    if (!tool) {
      console.warn("handleClearConversation aborted: currentTool is null");
      return;
    }
    try {
      await APIService.getInstance().clearConversation(tool.id, user?.uid || 'anonymous');
    } catch (error) {
      console.error("Error clearing conversation:", error);
    }
  };

  const handleToolSubmit = async (formData: Record<string, any>) => {
    try {
      setShowInputModal(false);
      setGenerating(true);

      const requestData = {
        ...formData,
        metadata: {
          toolId: currentTool!.id,
          toolName: currentTool!.name,
          userId: user?.uid,
          schoolId: schoolId
        }
      };

      // Add loading message
      const loadingMessageId = Date.now().toString();
      setMessages([{
        id: loadingMessageId,
        type: 'assistant',
        content: 'Generating response',
        isLoading: true
      }]);

      // Get response stream
      const stream = await apiService.generateToolResponse(currentTool!.navigation, requestData);

      if (!stream) {
        throw new Error('No response stream received');
      }

      // Read the stream
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      // Replace loading message with actual content
      setMessages([{
        id: loadingMessageId,
        type: 'assistant',
        content: '',
        isLoading: false
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Update message content
        setMessages(prev => prev.map(msg =>
            msg.id === loadingMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg
        ));
      }
    } catch (error) {
      console.error('Error generating response:', error);
      // Show error message in the chat
      setMessages([{
        id: Date.now().toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error while generating the response. Please try again.',
        isError: true
      }]);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpPrompt.trim() || generating) return;

    try {
      setGenerating(true);

      // Add user message
      const userMessageId = Date.now().toString();
      setMessages(prev => [...prev, {
        id: userMessageId,
        type: 'user',
        content: followUpPrompt
      }]);

      // Add loading message
      const aiMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: aiMessageId,
        type: 'assistant',
        content: '',
        isLoading: true
      }]);

      // Add metadata to request
      const requestData = {
        prompt: followUpPrompt,
        metadata: {
          toolId: currentTool!.id,
          toolName: currentTool!.name,
          userId: user?.uid,
          schoolId: schoolId
        }
      };

      // Get response stream
      const stream = await apiService.generateToolResponse(currentTool!.navigation, requestData);

      if (!stream) {
        throw new Error('No response stream received');
      }

      // Read the stream
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      setFollowUpPrompt('');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Update AI message with new chunk
        setMessages(prev => prev.map(msg =>
            msg.id === aiMessageId
                ? { ...msg, content: msg.content + chunk, isLoading: false }
                : msg
        ));
      }
    } catch (error) {
      console.error('Error with follow-up:', error);
      // Show error message in the chat
      setMessages(prev => [...prev.slice(0, -1), {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        isError: true
      }]);
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    setFormKey(prev => prev + 1);
  };

  if (toolsLoading) {
    return (
        <div className="min-h-screen bg-background dark:bg-dark-background flex items-center justify-center">
          <LoadingSpinner />
        </div>
    );
  }

  if (error) {
    navigate('/tools');
    return null;
  }

  if (!currentTool) {
    return null;
  }

  const IconComponent = getIconComponent(currentTool.icon);

  return (
      <>
        <MetaTags
            title={`${currentTool.name} | TeachAI`}
            description={currentTool.description}
            canonicalUrl={`/tools/${currentTool.navigation}`}
        />

        <div className="h-screen flex flex-col bg-background dark:bg-dark-background">
          {/* Tool Meta Info */}
          <div className="px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/10 dark:bg-accent/20 rounded-lg">
                    {IconComponent && <IconComponent className="h-6 w-6 text-accent" />}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-primary-dark dark:text-dark-text">{currentTool.name}</h1>
                    <p className="text-primary dark:text-dark-text-secondary mt-1">{currentTool.description}</p>
                  </div>
                </div>
                <Link
                    to="/tools"
                    className="inline-flex items-center px-4 py-2 text-accent hover:text-accent-dark dark:text-accent dark:hover:text-accent-dark transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Tools
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full max-w-7xl mx-auto px-8 py-6 flex flex-col">
              {/* Chat Area */}
              <div className="flex-1 bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border flex flex-col overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto">
                  <MessageList
                      messages={messages}
                      isLoading={generating}
                      toolName={currentTool.name}
                      toolId={currentTool.id}
                      onCopyMessage={(messageId) => {
                        const message = messages.find(m => m.id === messageId);
                        if (message) {
                          handleCopyMessage(message.content, messageId);
                        }
                      }}
                      onExport={(messageId, format) => {
                        const message = messages.find(m => m.id === messageId);
                        if (message) {
                          handleExport(message.content, format);
                        }
                      }}
                      showExportMenu={showExportMenu}
                      setShowExportMenu={setShowExportMenu}
                      copiedMessageId={copiedMessageId}
                  />
                </div>

                {/* Input Area */}
                <div className="border-t border-sage/10 dark:border-dark-border bg-white dark:bg-dark-nav p-6">
                  <MessageInput
                      value={followUpPrompt}
                      onChange={setFollowUpPrompt}
                      onSubmit={handleSubmit}
                      isLoading={generating}
                  />
                </div>
              </div>

              {/* AI Warning */}
              <div className="mt-4 text-center text-accent dark:text-accent">
                <AlertTriangle className="h-4 w-4 inline-block mr-2" />
                This is AI-generated content. Please review and verify before use.
              </div>
            </div>
          </div>
        </div>

        {/* Input Modal */}
        {showInputModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" onClick={() => navigate('/tools')} />

              <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white dark:bg-dark-nav rounded-2xl shadow-xl dark:shadow-dark-soft w-full max-w-4xl p-8 border border-sage/10 dark:border-dark-border">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-accent/10 dark:bg-accent/20 rounded-lg">
                        {IconComponent && <IconComponent className="h-6 w-6 text-accent" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-primary-dark dark:text-dark-text">{currentTool.name}</h3>
                        <p className="text-sm text-primary dark:text-dark-text-secondary mt-1">{currentTool.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                          onClick={handleReset}
                          className="inline-flex items-center text-primary dark:text-dark-text-secondary hover:text-primary-dark dark:hover:text-dark-text"
                      >
                        <RefreshCw className="h-5 w-5 mr-1" />
                        <span>Reset</span>
                      </button>
                      <button
                          onClick={() => navigate('/tools')}
                          className="text-primary dark:text-dark-text-secondary hover:text-primary-dark dark:hover:text-dark-text"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <ToolForm
                      key={formKey}
                      tool={currentTool}
                      onSubmit={handleToolSubmit}
                      loading={generating}
                  />
                </div>
              </div>
            </div>
        )}
      </>
  );
}