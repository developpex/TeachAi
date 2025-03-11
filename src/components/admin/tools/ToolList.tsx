import { useState } from 'react';
import { Edit2, Trash2, Search } from 'lucide-react';
import type { Tool } from '../../../types';
import {PLAN} from "../../../utils/constants.ts";

interface ToolListProps {
  tools: Tool[];
  onEdit: (tool: Tool) => void;
  onDelete: (id: string) => void;
}

export function ToolList({ tools, onEdit, onDelete }: ToolListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting tool:', error);
    }
  };

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.toolCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/60 dark:text-dark-text-secondary/60" />
        <input
          type="text"
          placeholder="Search tools by name, description, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-nav border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text placeholder-primary/50 dark:placeholder-dark-text-secondary/50 focus:outline-none focus:ring-accent focus:border-accent"
        />
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredTools.length === 0 ? (
          <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8 text-center">
            <p className="text-primary dark:text-dark-text-secondary">No tools found matching your search.</p>
          </div>
        ) : (
          filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-primary-dark dark:text-dark-text">
                      {tool.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tool.category === PLAN.FREE 
                        ? 'bg-mint/20 dark:bg-mint/10 text-primary dark:text-dark-text'
                        : tool.category === PLAN.PLUS
                        ? 'bg-accent/20 text-accent-dark dark:text-accent'
                        : 'bg-sage/20 dark:bg-sage/10 text-primary-dark dark:text-dark-text'
                    }`}>
                      {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
                    </span>
                  </div>
                  <p className="text-primary dark:text-dark-text-secondary mb-4">{tool.description}</p>
                  <p className="text-sm text-primary dark:text-dark-text-secondary">
                    Navigation: {tool.navigation}
                  </p>
                  
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-primary-dark dark:text-dark-text">Fields:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tool.fields.map((field, index) => (
                        <div key={index} className="p-3 bg-sage/5 dark:bg-dark-surface rounded-lg">
                          <p className="font-medium text-primary-dark dark:text-dark-text">{field.label}</p>
                          <p className="text-sm text-primary dark:text-dark-text-secondary">Type: {field.type}</p>
                          {field.options && (
                            <p className="text-sm text-primary dark:text-dark-text-secondary mt-1">
                              Options: {field.options.join(', ')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(tool)}
                    className="p-2 text-primary dark:text-dark-text-secondary hover:text-primary-dark dark:hover:text-dark-text"
                    title="Edit tool"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  
                  {deleteConfirm === tool.id ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDelete(tool.id)}
                        className="px-3 py-1 bg-accent text-white text-sm rounded-lg hover:bg-accent-dark"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1 text-primary dark:text-dark-text-secondary text-sm hover:text-primary-dark dark:hover:text-dark-text"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(tool.id)}
                      className="p-2 text-accent hover:text-accent-dark dark:text-accent dark:hover:text-accent-dark"
                      title="Delete tool"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}