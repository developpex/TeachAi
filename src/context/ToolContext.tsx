import React, { useState, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToolUsage } from '../hooks/useToolUsage';
import { useAuth } from './AuthContext';
import type { Tool } from '../types';
import { MockAIService } from '../services/deepseek/MockAIService';
import { PLAN } from "../utils/constants";

interface ToolContextType {
  handleGenerate: (prompt: string | null) => Promise<string | null>;
  handleFollowUp: (prompt: string) => Promise<void>;
  openTool: (tool: Tool) => void;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export function ToolProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { usageLimit, trackUsage, refreshUsage } = useToolUsage();
  const mockAIService = MockAIService.getInstance();

  const openTool = (tool: Tool) => {
    console.log('[ToolContext] Opening tool:', tool.name);
    
    // If user is on free plan and has no remaining uses, show limit modal
    if (userProfile?.plan === PLAN.FREE && usageLimit?.remainingUses === 0) {
      console.log('[ToolContext] No remaining uses');
      return;
    }
    
    navigate(`/tools/${tool.navigation}`);
  };

  const handleGenerate = async (prompt: string | null): Promise<string | null> => {
    if (!prompt) return null;

    try {
      // If user is on free plan, track usage immediately
      if (userProfile?.plan === PLAN.FREE) {
        console.log('[ToolContext] Free plan user, tracking usage');
        const canProceed = await trackUsage('tool-id', 'tool-name');
        console.log('[ToolContext] Usage tracked, can proceed:', canProceed);
        
        if (!canProceed) {
          console.log('[ToolContext] Cannot proceed');
          return null;
        }
        
        // Refresh usage limit after tracking
        await refreshUsage();
      }

      const response = await mockAIService.generateResponse(prompt);
      return response;
    } catch (error) {
      console.error('[ToolContext] Error generating response:', error);
      return null;
    }
  };

  const handleFollowUp = async (prompt: string) => {
    console.log('[ToolContext] Handling follow-up prompt');
    try {
      const response = await mockAIService.generateResponse(prompt);
      return response;
    } catch (error) {
      console.error('[ToolContext] Error sending follow-up:', error);
    }
  };

  return (
    <ToolContext.Provider 
      value={{ 
        handleGenerate,
        handleFollowUp,
        openTool
      }}
    >
      {children}
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