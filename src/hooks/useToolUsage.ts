import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UsageService } from '../services/usage';
import type { UsageLimit } from '../services/usage/types';

export function useToolUsage() {
  const [usageLimit, setUsageLimit] = useState<UsageLimit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userProfile } = useAuth();
  const usageService = UsageService.getInstance();

  const refreshUsage = async () => {
    if (userProfile?.plan !== 'free') return;
    
    try {
      setLoading(true);
      setError(null);
      const limit = await usageService.getWeeklyUsageLimit();
      setUsageLimit(limit);
    } catch (err) {
      console.error('Error fetching usage limit:', err);
      setError('Failed to fetch usage limit');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.plan === 'free') {
      // Set up real-time subscription
      const unsubscribe = usageService.subscribeToToolUsage((limit) => {
        setUsageLimit(limit);
        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    } else {
      setUsageLimit(null);
      setLoading(false);
    }
  }, [userProfile?.plan]);

  const trackUsage = async (toolId: string, toolName: string) => {
    if (userProfile?.plan !== 'free') return true;

    try {
      const canUse = await usageService.canUseTools();
      if (!canUse) {
        return false;
      }

      await usageService.trackToolUsage(toolId, toolName);
      return true;
    } catch (err) {
      console.error('Error tracking tool usage:', err);
      return false;
    }
  };

  return {
    usageLimit,
    loading,
    error,
    trackUsage,
    refreshUsage
  };
}