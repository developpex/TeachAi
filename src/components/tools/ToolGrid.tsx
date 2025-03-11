import { useAuth } from '../../context/AuthContext';
import { ToolCard } from './ToolCard';
import type { Tool } from '../../types';

interface ToolGridProps {
  tools: Tool[];
  title?: string;
}

export function ToolGrid({ tools, title }: ToolGridProps) {
  const { toggleFavorite } = useAuth();

  if (tools.length === 0) return null;

  return (
    <div className="mb-12">
      {title && (
        <h2 className="text-2xl font-semibold text-primary-dark dark:text-dark-text mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool, index) => (
          <ToolCard
            key={tool.id || index} // Use tool.id if available, otherwise fallback to index
            tool={tool}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}