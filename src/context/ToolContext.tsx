import React, { useState, useContext, createContext } from 'react';
import { ToolModal } from '../components/ToolModal';
import { AIModal } from '../components/AIModal';
import { UsageLimitModal } from '../components/tools/UsageLimitModal';
import { useToolUsage } from '../hooks/useToolUsage';
import { useAuth } from './AuthContext';
import type { Tool } from '../types';
import { DeepseekAIService } from '../services/deepseek/deepseekai';

interface ToolContextType {
  selectedTool: Tool | null;
  isToolModalOpen: boolean;
  isAIModalOpen: boolean;
  openToolModal: (tool: Tool) => void;
  closeToolModal: () => void;
  closeAIModal: () => void;
  handleGenerate: (response: string | null) => void;
  handleFollowUp: (prompt: string) => Promise<void>;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export function ToolProvider({ children }: { children: React.ReactNode }) {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);
  const [aiResponse, setAIResponse] = useState<string | null>(null);
  const { userProfile } = useAuth();
  const { usageLimit, trackUsage, refreshUsage } = useToolUsage();
  const deepseekService = DeepseekAIService.getInstance();

  const openToolModal = (tool: Tool) => {
    console.log('[ToolContext] Opening tool modal for:', tool.name);
    
    // If user is on free plan and has no remaining uses, show limit modal
    if (userProfile?.plan === 'free' && usageLimit?.remainingUses === 0) {
      console.log('[ToolContext] No remaining uses, showing limit modal');
      setShowUsageLimitModal(true);
      return;
    }
    
    setSelectedTool(tool);
    setIsToolModalOpen(true);
  };

  const closeToolModal = () => {
    console.log('[ToolContext] Closing tool modal');
    setIsToolModalOpen(false);
  };

  const closeAIModal = () => {
    console.log('[ToolContext] Closing AI modal');
    setIsAIModalOpen(false);
    setAIResponse(null);
    setSelectedTool(null);
    deepseekService.clearConversation();
  };

  const handleGenerate = async (response: string | null) => {
    console.log('[ToolContext] handleGenerate called with response:', !!response);
    
    // If response is null, it means we're starting generation
    if (!response) {
      console.log('[ToolContext] Starting generation process');
      
      // If user is on free plan, track usage immediately
      if (userProfile?.plan === 'free' && selectedTool) {
        console.log('[ToolContext] Free plan user, tracking usage');
        try {
          // Track usage first
          const canProceed = await trackUsage(selectedTool.id, selectedTool.name);
          console.log('[ToolContext] Usage tracked, can proceed:', canProceed);
          
          if (!canProceed) {
            console.log('[ToolContext] Cannot proceed, showing limit modal');
            setShowUsageLimitModal(true);
            setIsToolModalOpen(false);
            return;
          }
          
          // Refresh usage limit after tracking
          await refreshUsage();
        } catch (error) {
          console.error('[ToolContext] Error tracking tool usage:', error);
          setIsToolModalOpen(false);
          return;
        }
      }
      
      // Close tool modal and show AI modal
      setIsToolModalOpen(false);
      setAIResponse(null);
      setIsAIModalOpen(true);
      return;
    }

    // Show the response
    console.log('[ToolContext] Showing AI response');
    setAIResponse(response);
  };

  const handleFollowUp = async (prompt: string) => {
    console.log('[ToolContext] Handling follow-up prompt');
    try {
      const response = await deepseekService.generateResponse(prompt);
      setAIResponse(response);
    } catch (error) {
      console.error('[ToolContext] Error sending follow-up:', error);
    }
  };

  return (
    <ToolContext.Provider 
      value={{ 
        selectedTool,
        isToolModalOpen,
        isAIModalOpen,
        openToolModal,
        closeToolModal,
        closeAIModal,
        handleGenerate,
        handleFollowUp
      }}
    >
      {children}
      {selectedTool && (
        <ToolModal
          isOpen={isToolModalOpen}
          onClose={closeToolModal}
          tool={selectedTool}
          onGenerate={handleGenerate}
        />
      )}
      {selectedTool && (
        <AIModal
          isOpen={isAIModalOpen}
          onClose={closeAIModal}
          response={aiResponse}
          onSendFollowUp={handleFollowUp}
          tool={selectedTool}
        />
      )}
      {usageLimit && (
        <UsageLimitModal
          isOpen={showUsageLimitModal}
          onClose={() => setShowUsageLimitModal(false)}
          usageLimit={usageLimit}
        />
      )}
    </ToolContext.Provider>
  );
}

export function useToolContext() {
  const context = useContext(ToolContext);
  if (context === undefined) {
    throw new Error('useToolContext must be used within a ToolProvider');
  }
  return context;
}