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
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedToolCategory, setSelectedToolCategory] = useState<ToolCategory>('all' as ToolCategory);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTools = async () => {
      const firestoreService = FirestoreService.getInstance();
      const allTools = await firestoreService.getAllTools();
      setTools(allTools);
      setLoading(false);
    };

    fetchTools();
  }, []);

  const getToolWithFavoriteStatus = (tool: Tool) => ({
    ...tool,
    isFavorite: userProfile?.favorites?.includes(tool.id) || false
  });

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

    if (options.filterByCategory) {
      filtered = filtered.filter(tool =>
        selectedCategory === 'all' || tool.category === selectedCategory
      );
    }

    if (options.filterByToolCategory) {
      filtered = filtered.filter(tool =>
        selectedToolCategory === 'all' || tool.toolCategory === selectedToolCategory
      );
    }

    if (options.searchEnabled && searchQuery) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.map(getToolWithFavoriteStatus);
  }, [availableTools, selectedCategory, selectedToolCategory, searchQuery, options]);

  const categorizedTools = useMemo(() => {
    const filtered = selectedCategory === 'all'
        ? filteredTools
        : filteredTools.filter(tool => tool.category === selectedCategory);

    return Object.values(PLAN).reduce((acc, tier) => {
      acc[tier] = filtered.filter(tool => tool.category === tier);
      return acc;
    }, {} as Record<Category, Tool[]>);
  }, [filteredTools, selectedCategory]);


  const favoriteTools = useMemo(() =>
    filteredTools.filter(tool => userProfile?.favorites?.includes(tool.id)),
    [filteredTools, userProfile?.favorites]
  );

  const otherTools = useMemo(() =>
    filteredTools.filter(tool => !userProfile?.favorites?.includes(tool.id)),
    [filteredTools, userProfile?.favorites]
  );

  const availableCategories = useMemo(() => {
    return ['all', ...Object.values(PLAN).filter(tier => categorizedTools[tier]?.length > 0)];
  }, [categorizedTools]);

  return {
    loading,
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