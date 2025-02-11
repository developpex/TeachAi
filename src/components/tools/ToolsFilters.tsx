import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface ToolsFiltersProps {
  availableCategories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedToolCategory: string;
  setSelectedToolCategory: (category: string) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
  getToolCategoryLabel: (category: string) => string;
}

export function ToolsFilters({
  availableCategories,
  selectedCategory,
  setSelectedCategory,
  selectedToolCategory,
  setSelectedToolCategory,
  isDropdownOpen,
  setIsDropdownOpen,
  getToolCategoryLabel
}: ToolsFiltersProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-center space-x-4 flex-wrap gap-2">
        {/* Pricing Categories */}
        {availableCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as any)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-accent text-white shadow-soft'
                : 'bg-white text-primary hover:bg-mint/10'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}

        {/* Tool Categories Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-primary rounded-lg hover:bg-mint/10 transition-all duration-300"
          >
            <Filter className="h-5 w-5" />
            <span>{getToolCategoryLabel(selectedToolCategory)}</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-50 mt-2 w-64 bg-white rounded-lg shadow-lg border border-sage/10 py-2">
              {(['all', 'lesson-planning', 'subject-specific', 'student-centered', 'administrative', 'cultural'] as const).map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedToolCategory(category);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-mint/10 transition-colors duration-300 ${
                    selectedToolCategory === category ? 'bg-mint/20 text-primary-dark' : 'text-primary'
                  }`}
                >
                  {getToolCategoryLabel(category)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}