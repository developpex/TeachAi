import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="p-4 border-b border-sage/10">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/60" />
        <input
          type="text"
          placeholder="Search channels..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-sage/5 border-none rounded-lg text-sm placeholder-primary/50 focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>
    </div>
  );
}