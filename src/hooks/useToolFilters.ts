import { useState, useMemo } from 'react';
import type { Tool } from '../types';

type Category = 'all' | 'free' | 'plus' | 'enterprise';
type ToolCategory = 'all' | 'lesson-planning' | 'subject-specific' | 'student-centered' | 'administrative' | 'cultural';

export function useToolFilters(tools: Tool[]) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedToolCategory, setSelectedToolCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesToolCategory = selectedToolCategory === 'all' || tool.toolCategory === selectedToolCategory;
      const matchesSearch = searchQuery === '' || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesToolCategory && matchesSearch;
    });
  }, [selectedCategory, selectedToolCategory, searchQuery, tools]);

  const categorizedTools = useMemo(() => {
    const filtered = selectedCategory === 'all' ? filteredTools : filteredTools.filter(tool => tool.category === selectedCategory);
    return {
      free: filtered.filter(tool => tool.category === 'free'),
      plus: filtered.filter(tool => tool.category === 'plus'),
      enterprise: filtered.filter(tool => tool.category === 'enterprise')
    };
  }, [filteredTools, selectedCategory]);

  return {
    selectedCategory,
    setSelectedCategory,
    selectedToolCategory,
    setSelectedToolCategory,
    searchQuery,
    setSearchQuery,
    filteredTools,
    categorizedTools
  };
}