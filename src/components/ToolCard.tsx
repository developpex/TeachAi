import React from 'react';
import { Star, StarOff } from 'lucide-react';
import { getIconComponent } from '../utils/icons';
import type { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onToggleFavorite: (id: string) => void;
}

export function ToolCard({ tool, onToggleFavorite }: ToolCardProps) {
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await onToggleFavorite(tool.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const IconComponent = getIconComponent(tool.icon);

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 border border-sand">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-accent/10 rounded-lg">
            {IconComponent && <IconComponent className="h-6 w-6 text-accent" />}
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
        <span className={`text-sm px-3 py-1.5 rounded-full ${
          tool.category === 'free' 
            ? 'bg-mint/20 text-primary'
            : tool.category === 'plus'
            ? 'bg-accent/20 text-accent-dark'
            : 'bg-sage/20 text-primary-dark'
        }`}>
          {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
        </span>
        <span className="text-sm px-3 py-1.5 rounded-full border border-sage/20 text-primary-dark">
          {tool.toolCategory.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </span>
      </div>
    </div>
  );
}