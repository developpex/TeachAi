import { Star, StarOff } from 'lucide-react';
import { getIconComponent } from '../../utils/icons.ts';
import type { Tool } from '../../types';
import { PLAN } from "../../utils/constants.ts";
import { Link } from 'react-router-dom';

interface ToolCardProps {
  tool: Tool;
  onToggleFavorite: (id: string) => void;
}

export function ToolCard({ tool, onToggleFavorite }: ToolCardProps) {
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking favorite
    e.stopPropagation();
    try {
      await onToggleFavorite(tool.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const IconComponent = getIconComponent(tool.icon);

  return (
    <Link 
      to={`/tools/${tool.navigation}`}
      className="block bg-white dark:bg-dark-surface rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-sand dark:border-dark-border hover:shadow-lg transition-all duration-300"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-accent/10 dark:bg-accent/20 rounded-lg">
            {IconComponent && <IconComponent className="h-6 w-6 text-accent" />}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-primary-dark dark:text-dark-text">{tool.name}</h3>
            <p className="mt-2 text-primary dark:text-dark-text-secondary">{tool.description}</p>
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
          tool.category === PLAN.FREE 
            ? 'bg-mint/20 dark:bg-mint/10 text-primary dark:text-dark-text'
            : tool.category === PLAN.PLUS
            ? 'bg-accent/20 text-accent-dark dark:text-accent'
            : 'bg-sage/20 dark:bg-sage/10 text-primary-dark dark:text-dark-text'
        }`}>
          {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
        </span>
        <span className="text-sm px-3 py-1.5 rounded-full border border-sage/20 dark:border-dark-border text-primary-dark dark:text-dark-text">
          {tool.toolCategory.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </span>
      </div>
    </Link>
  );
}