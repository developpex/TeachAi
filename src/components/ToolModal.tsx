import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Tool, OpenAIResponse } from '../types';
import { OpenAIService } from '../services/openai'; // Fixed import

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool;
  onGenerate: (response: OpenAIResponse | null) => void;
}

export function ToolModal({ isOpen, onClose, tool, onGenerate }: ToolModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const openAIService = OpenAIService.getInstance(); // Get instance here

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      onGenerate(null);
      
      const prompt = `Tool: ${tool.name}\n\n${Object.entries(formData)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')}`;
      
      const response = await openAIService.generateResponse(prompt);
      onGenerate(response);
    } catch (error) {
      console.error('Error generating response:', error);
      onClose();
    }
  };

  const handleInputChange = (label: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [label]: value
    }));
  };

  const renderField = (field: ToolField) => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg text-primary-dark placeholder-primary/50 focus:outline-none focus:ring-accent focus:border-accent resize-none"
            rows={4}
          />
        );
      
      case 'select':
        return (
          <select
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg text-primary-dark focus:outline-none focus:ring-accent focus:border-accent"
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
            onChange={(e) => handleInputChange(field.label, e.target.value)}
            className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg text-primary-dark placeholder-primary/50 focus:outline-none focus:ring-accent focus:border-accent"
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-sage/10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-primary-dark">{tool.name}</h3>
              <p className="mt-1 text-sm text-primary">{tool.description}</p>
            </div>
            <button onClick={onClose} className="text-primary hover:text-primary-dark">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {tool.fields.map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-primary-dark mb-1">
                  {field.label}
                </label>
                {renderField(field)}
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-accent text-white px-4 py-3 rounded-lg hover:bg-accent-dark transition-all duration-300 shadow-soft"
            >
              Generate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}