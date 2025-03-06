import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import type { Tool, ToolField } from '../../../types';

interface ToolFormProps {
  tool: Tool;
  onSubmit: (prompt: string) => void;
  loading: boolean;
  onReset?: () => void;
}

export function ToolForm({ tool, onSubmit, loading, onReset }: ToolFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const prompt = `Tool: ${tool.name}\n\n${Object.entries(formData)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')}`;
      
      onSubmit(prompt);
    } catch (error) {
      console.error('Error generating response:', error);
    }
  };

  const handleInputChange = (label: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [label]: value
    }));
  };

  const handleReset = () => {
    setFormData({});
    if (onReset) {
      onReset();
    }
  };

  const renderField = (field: ToolField) => {
    const baseInputClasses = "w-full px-4 py-3 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text placeholder-primary/50 dark:placeholder-dark-text-secondary/50 focus:outline-none focus:ring-accent focus:border-accent bg-white dark:bg-dark-surface";

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            value={formData[field.label] || ''}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            className={`${baseInputClasses} resize-none`}
            rows={4}
          />
        );
      
      case 'select':
        return (
          <select
            value={formData[field.label] || ''}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            className={baseInputClasses}
          >
            <option value="">Select {field.label.toLowerCase()}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      default: // input type
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            value={formData[field.label] || ''}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            className={baseInputClasses}
          />
        );
    }
  };

  // Separate fields into regular inputs and textareas
  const regularFields = tool.fields.filter(field => field.type !== 'textarea');
  const textareaFields = tool.fields.filter(field => field.type === 'textarea');

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Regular inputs in a grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {regularFields.map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
              {field.label}
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>

      {/* Textareas always at the bottom */}
      {textareaFields.length > 0 && (
        <div className="space-y-6">
          {textareaFields.map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
                {field.label}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 shadow-soft dark:shadow-dark-soft disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </form>
  );
}