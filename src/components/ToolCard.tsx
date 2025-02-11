import React from 'react';
import { Star, StarOff, Map, TestTube, Square, BookText, BookOpen, CheckSquare, Layout, LineChart, HelpCircle, BarChart2, GitBranch, Database, Presentation, Mail, Calendar, Trophy, Mic, Heart, Search, Bot } from 'lucide-react';
import type { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onToggleFavorite: (id: string) => void;
}

export function ToolCard({ tool, onToggleFavorite }: ToolCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(tool.id);
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'free':
        return 'bg-mint/20 text-primary';
      case 'plus':
        return 'bg-coral/20 text-accent-dark';
      default:
        return 'bg-sky/20 text-primary-dark';
    }
  };

  const getToolCategoryStyles = (category: string) => {
    switch (category) {
      case 'lesson-planning':
        return 'border-sage text-primary-dark';
      case 'subject-specific':
        return 'border-mint text-primary';
      case 'student-centered':
        return 'border-sky text-primary-dark';
      case 'administrative':
        return 'border-coral text-accent-dark';
      case 'cultural':
        return 'border-sand text-primary-dark';
      default:
        return 'border-sage text-primary-dark';
    }
  };

  const getToolCategoryLabel = (category: string) => {
    switch (category) {
      case 'lesson-planning':
        return 'Lesson Planning';
      case 'subject-specific':
        return 'Subject-Specific';
      case 'student-centered':
        return 'Student-Centered';
      case 'administrative':
        return 'Administrative';
      case 'cultural':
        return 'Cultural';
      default:
        return category;
    }
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      Map, TestTube, Square, BookText, BookOpen, CheckSquare, Layout,
      LineChart, HelpCircle, BarChart2, GitBranch, Database, Presentation,
      Mail, Calendar, Trophy, Mic, Heart, Search, Bot
    };
    
    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent className="h-6 w-6 text-accent" /> : null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 border border-sand">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-accent/10 rounded-lg">
            {getIcon(tool.icon)}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-primary-dark">{tool.name}</h3>
            <p className="mt-2 text-gray-600">{tool.description}</p>
          </div>
        </div>
        <button
          onClick={handleFavoriteClick}
          className="text-coral hover:text-accent transition-colors duration-300"
        >
          {tool.isFavorite ? (
            <Star className="h-6 w-6 fill-current" />
          ) : (
            <StarOff className="h-6 w-6" />
          )}
        </button>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`text-sm px-3 py-1.5 rounded-full ${getCategoryStyles(tool.category)}`}>
          {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
        </span>
        <span className={`text-sm px-3 py-1.5 rounded-full border ${getToolCategoryStyles(tool.toolCategory)}`}>
          {getToolCategoryLabel(tool.toolCategory)}
        </span>
      </div>
    </div>
  );
}