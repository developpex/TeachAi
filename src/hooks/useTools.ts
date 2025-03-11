import { useState, useEffect, useMemo } from 'react';
import { FirestoreService } from '../services/firestore';
import { useAuth } from '../context/AuthContext';
import type { Tool } from '../types';
import { PLAN, TOOL_CATEGORIES } from '../utils/constants';

type Category = typeof PLAN[keyof typeof PLAN] | 'all'
type ToolCategory = typeof TOOL_CATEGORIES[number];

interface UseToolsOptions {
  filterByCategory?: boolean;
  filterByToolCategory?: boolean;
  searchEnabled?: boolean;
}

export function useTools(options: UseToolsOptions = {}) {
  const { userProfile } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedToolCategory, setSelectedToolCategory] = useState<ToolCategory>('all' as ToolCategory);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchTools = async () => {
      try {
        setLoading(true);
        const firestoreService = FirestoreService.getInstance();
        const allTools = await firestoreService.getAllTools();
        
        if (mounted) {
          setTools(allTools);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching tools:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch tools');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTools();

    return () => {
      mounted = false;
    };
  }, []);

  const userPlan = userProfile?.plan || PLAN.FREE;
  const isTrialActive = userProfile?.isTrialActive || false;

  const availableTools = useMemo(() => {
    return tools.filter(tool => {
      if (tool.category === PLAN.FREE) return true;
      if (userPlan === PLAN.ENTERPRISE) return true;
      return tool.category === PLAN.PLUS && (userPlan === PLAN.PLUS || isTrialActive);
    });
  }, [tools, userPlan, isTrialActive]);

  const filteredTools = useMemo(() => {
    let filtered = availableTools;

    if (options.filterByCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    if (options.filterByToolCategory && selectedToolCategory !== 'all') {
      filtered = filtered.filter(tool => tool.toolCategory === selectedToolCategory);
    }

    if (options.searchEnabled && searchQuery) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.map(tool => ({
      ...tool,
      isFavorite: userProfile?.favorites?.includes(tool.id) || false
    }));
  }, [availableTools, selectedCategory, selectedToolCategory, searchQuery, options, userProfile?.favorites]);

  const categorizedTools = useMemo(() => {
    return Object.values(PLAN).reduce((acc, tier) => {
      acc[tier] = filteredTools.filter(tool => tool.category === tier);
      return acc;
    }, {} as Record<Category, Tool[]>);
  }, [filteredTools]);

  const favoriteTools = useMemo(() =>
    filteredTools.filter(tool => userProfile?.favorites?.includes(tool.id)),
    [filteredTools, userProfile?.favorites]
  );

  const otherTools = useMemo(() =>
    filteredTools.filter(tool => !userProfile?.favorites?.includes(tool.id)),
    [filteredTools, userProfile?.favorites]
  );

  const availableCategories = useMemo(() => {
    return ['all', ...Object.values(PLAN)];
  }, []);

  return {
    loading,
    error,
    tools: filteredTools,
    favoriteTools,
    otherTools,
    categorizedTools,
    availableCategories,
    selectedCategory,
    setSelectedCategory,
    selectedToolCategory,
    setSelectedToolCategory,
    searchQuery,
    setSearchQuery,
    userPlan,
    isTrialActive
  };
}