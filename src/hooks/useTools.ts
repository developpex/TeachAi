import { useState, useEffect, useMemo } from 'react';
import { FirestoreService } from '../services/firestore';
import { useAuth } from '../context/AuthContext';
import type { Tool } from '../types';

type Category = 'all' | 'free' | 'plus' | 'enterprise';
type ToolCategory = 'all' | 'lesson-planning' | 'subject-specific' | 'student-centered' | 'administrative' | 'cultural';

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
  const [selectedToolCategory, setSelectedToolCategory] = useState<ToolCategory>('all');
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

  const userPlan = userProfile?.plan || 'free';
  const isTrialActive = userProfile?.isTrialActive || false;

  const availableTools = useMemo(() => {
    return tools.filter(tool => {
      // Show all free tools
      if (tool.category === 'free') return true;
      
      // If user has enterprise plan, show all tools
      if (userPlan === 'enterprise') return true;
      
      // If user has an active trial or plus plan, show plus tools
      if (tool.category === 'plus' && (userPlan === 'plus' || isTrialActive)) return true;
      
      return false;
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
    const filtered = selectedCategory === 'all' ? filteredTools : filteredTools.filter(tool => tool.category === selectedCategory);
    return {
      free: filtered.filter(tool => tool.category === 'free'),
      plus: filtered.filter(tool => tool.category === 'plus'),
      enterprise: filtered.filter(tool => tool.category === 'enterprise')
    };
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
    const categories = ['all'];
    if (categorizedTools.free.length > 0) categories.push('free');
    if (categorizedTools.plus.length > 0) categories.push('plus');
    if (categorizedTools.enterprise.length > 0) categories.push('enterprise');
    return categories;
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