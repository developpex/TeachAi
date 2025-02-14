import { ToolCard } from './ToolCard.tsx';
import { useAuth } from '../../context/AuthContext';
import { useToolContext } from '../../context/ToolContext';
import type { Tool } from '../../types';

interface ToolGridProps {
  tools: Tool[];
  title?: string;
}

export function ToolGrid({ tools, title }: ToolGridProps) {
  const { toggleFavorite } = useAuth();
  const { openToolModal } = useToolContext();

  if (tools.length === 0) return null;

  return (
    <div className="mb-12">
      {title && (
        <h2 className="text-2xl font-semibold text-primary-dark mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map(tool => (
          <div
            key={tool.id}
            onClick={() => openToolModal(tool)}
            className="cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <ToolCard
              tool={tool}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        ))}
      </div>
    </div>
  );
}