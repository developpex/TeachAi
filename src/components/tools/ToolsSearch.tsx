import { Search } from 'lucide-react';

interface ToolsSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ToolsSearch({ searchQuery, setSearchQuery }: ToolsSearchProps) {
  return (
    <div className="max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/60" />
        <input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border-2 border-sage/30 rounded-lg placeholder-primary/50 text-primary-dark focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        />
      </div>
    </div>
  );
}