import React, { useState } from 'react';
import { Edit2, Trash2, Search } from 'lucide-react';
import type { Tool } from '../../../types';

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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/60" />
        <input
          type="text"
          placeholder="Search tools by name, description, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border-2 border-sage/30 rounded-lg text-primary-dark placeholder-primary/50 focus:outline-none focus:ring-accent focus:border-accent"
        />
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredTools.length === 0 ? (
          <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8 text-center">
            <p className="text-primary">No tools found matching your search.</p>
          </div>
        ) : (
          filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white rounded-lg shadow-soft border border-sage/10 p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-primary-dark">
                      {tool.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tool.category === 'free' 
                        ? 'bg-mint/20 text-primary'
                        : tool.category === 'plus'
                        ? 'bg-accent/20 text-accent-dark'
                        : 'bg-sage/20 text-primary-dark'
                    }`}>
                      {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
                    </span>
                  </div>
                  <p className="text-primary mb-4">{tool.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-primary-dark">Fields:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tool.fields.map((field, index) => (
                        <div key={index} className="p-3 bg-sage/5 rounded-lg">
                          <p className="font-medium text-primary-dark">{field.label}</p>
                          <p className="text-sm text-primary">Type: {field.type}</p>
                          {field.options && (
                            <p className="text-sm text-primary mt-1">
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
                    className="p-2 text-primary hover:text-primary-dark"
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
                        className="px-3 py-1 text-primary text-sm hover:text-primary-dark"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(tool.id)}
                      className="p-2 text-accent hover:text-accent-dark"
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