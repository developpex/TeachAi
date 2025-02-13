import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { Tool, ToolField } from '../../../types';

interface CreateToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (tool: Omit<Tool, 'id'>) => Promise<string>;
}

export function CreateToolModal({ isOpen, onClose, onCreate }: CreateToolModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Tool['category']>('free');
  const [toolCategory, setToolCategory] = useState('lesson-planning');
  const [icon, setIcon] = useState('BookOpen');
  const [fields, setFields] = useState<ToolField[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const addField = () => {
    setFields([
      ...fields,
      {
        label: '',
        placeholder: '',
        type: 'input'
      }
    ]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<ToolField>) => {
    setFields(fields.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Tool name is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    if (fields.length === 0) {
      setError('At least one field is required');
      return;
    }

    // Validate fields
    for (const field of fields) {
      if (!field.label.trim()) {
        setError('All fields must have a label');
        return;
      }
      if (!field.placeholder.trim()) {
        setError('All fields must have a placeholder');
        return;
      }
      if (field.type === 'select' && (!field.options || field.options.length === 0)) {
        setError('Select fields must have options');
        return;
      }
    }

    try {
      setLoading(true);
      await onCreate({
        name: name.trim(),
        description: description.trim(),
        category,
        toolCategory,
        icon,
        fields
      });
      
      // Reset form
      setName('');
      setDescription('');
      setCategory('free');
      setToolCategory('lesson-planning');
      setIcon('BookOpen');
      setFields([]);
      onClose();
    } catch (err) {
      console.error('Error creating tool:', err);
      setError('Failed to create tool');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 border border-sage/10">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-semibold text-primary-dark">Create New Tool</h3>
            <button onClick={onClose} className="text-primary hover:text-primary-dark">
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-coral/20 border border-accent rounded-lg text-accent-dark">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-1">
                  Tool Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
                  placeholder="Enter tool name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark mb-1">
                  Icon
                </label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
                  placeholder="Icon name from Lucide"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Tool['category'])}
                  className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
                >
                  <option value="free">Free</option>
                  <option value="plus">Plus</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark mb-1">
                  Tool Category
                </label>
                <select
                  value={toolCategory}
                  onChange={(e) => setToolCategory(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
                >
                  <option value="lesson-planning">Lesson Planning</option>
                  <option value="subject-specific">Subject Specific</option>
                  <option value="student-centered">Student Centered</option>
                  <option value="administrative">Administrative</option>
                  <option value="cultural">Cultural</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
                rows={3}
                placeholder="Enter tool description"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-primary-dark">
                  Fields
                </label>
                <button
                  type="button"
                  onClick={addField}
                  className="flex items-center text-accent hover:text-accent-dark"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Field
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-sage/5 rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateField(index, { label: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
                          placeholder="Field label"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-1">
                          Placeholder
                        </label>
                        <input
                          type="text"
                          value={field.placeholder}
                          onChange={(e) => updateField(index, { placeholder: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
                          placeholder="Field placeholder"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-1">
                          Type
                        </label>
                        <select
                          value={field.type}
                          onChange={(e) => updateField(index, { 
                            type: e.target.value as ToolField['type'],
                            options: e.target.value === 'select' ? [''] : undefined
                          })}
                          className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
                        >
                          <option value="input">Input</option>
                          <option value="textarea">Textarea</option>
                          <option value="select">Select</option>
                        </select>
                      </div>

                      {field.type === 'select' && (
                        <div>
                          <label className="block text-sm font-medium text-primary-dark mb-1">
                            Options (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={field.options?.join(', ') || ''}
                            onChange={(e) => updateField(index, { 
                              options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                            })}
                            className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeField(index)}
                      className="p-2 text-accent hover:text-accent-dark"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-primary hover:text-primary-dark"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Tool'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}