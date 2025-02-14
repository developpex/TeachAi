import { useState } from 'react';
import { useTools } from './useTools';

export function useToolsPage() {
  const {
    loading,
    categorizedTools,
    availableCategories,
    selectedCategory,
    setSelectedCategory,
    selectedToolCategory,
    setSelectedToolCategory,
    searchQuery,
    setSearchQuery,
    userPlan
  } = useTools({
    filterByCategory: true,
    filterByToolCategory: true,
    searchEnabled: true
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getToolCategoryLabel = (category: string) => {
    switch (category) {
      case 'lesson-planning':
        return 'Lesson Planning & Design';
      case 'subject-specific':
        return 'Subject-Specific Tools';
      case 'student-centered':
        return 'Student-Centered Tools';
      case 'administrative':
        return 'Administrative & Support';
      case 'cultural':
        return 'Cultural & Inclusive Education';
      default:
        return 'All Tools';
    }
  };

  return {
    loading,
    categorizedTools,
    availableCategories,
    selectedCategory,
    setSelectedCategory,
    selectedToolCategory,
    setSelectedToolCategory,
    searchQuery,
    setSearchQuery,
    userPlan,
    isDropdownOpen,
    setIsDropdownOpen,
    getToolCategoryLabel
  };
}