import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import type { Tool, ToolField } from '../../../types';
import { PLAN, TOOL_CATEGORIES } from "../../../utils/constants.ts";

interface EditToolModalProps {
  tool: Tool;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Tool>) => Promise<void>;
}

export function EditToolModal({ tool, onClose, onSave }: EditToolModalProps) {
  const [name, setName] = useState(tool.name);
  const [description, setDescription] = useState(tool.description);
  const [category, setCategory] = useState<Tool['category']>(tool.category);
  const [toolCategory, setToolCategory] = useState(tool.toolCategory);
  const [icon, setIcon] = useState(tool.icon);
  const [navigation, setNavigation] = useState(tool.navigation);
  const [fields, setFields] = useState<ToolField[]>(tool.fields);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const addField = () => {
    const newField: ToolField = {
      label: '',
      placeholder: '',
      type: 'input'
    };

    // If it's an enterprise tool, add a subject selection field if it doesn't exist
    if (category === PLAN.ENTERPRISE && !fields.some(f => f.isSubjectField)) {
      newField.type = 'select';
      newField.label = 'Subject';
      newField.placeholder = 'Select a subject';
      newField.isSubjectField = true;
    }

    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    // Don't allow removing subject field for enterprise tools
    if (fields[index].isSubjectField) return;
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<ToolField>) => {
    setFields(prev => prev.map((field, i) => 
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
      if (field.type === 'select' && !field.isSubjectField && (!field.options || field.options.length === 0)) {
        setError('Select fields must have options');
        return;
      }
    }

    try {
      setLoading(true);
      await onSave(tool.id, {
        name: name.trim(),
        description: description.trim(),
        category,
        toolCategory,
        icon,
        navigation,
        fields
      });
      onClose();
    } catch (err) {
      console.error('Error updating tool:', err);
      setError(err instanceof Error ? err.message : 'Failed to update tool');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-dark-nav rounded-2xl shadow-xl dark:shadow-dark-soft w-full max-w-3xl p-8 border border-sage/10 dark:border-dark-border">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-semibold text-primary-dark dark:text-dark-text">Edit Tool</h3>
            <button onClick={onClose} className="text-primary dark:text-dark-text-secondary hover:text-primary-dark dark:hover:text-dark-text">
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-coral/20 dark:bg-coral/10 border border-accent rounded-lg text-accent-dark">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
                  Tool Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface focus:outline-none focus:ring-accent focus:border-accent"
                  placeholder="Enter tool name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
                  Icon
                </label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface focus:outline-none focus:ring-accent focus:border-accent"
                  placeholder="Icon name from Lucide"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    const newCategory = e.target.value as Tool['category'];
                    setCategory(newCategory);
                    
                    // Add subject field for enterprise tools
                    if (newCategory === PLAN.ENTERPRISE && !fields.some(f => f.isSubjectField)) {
                      setFields(prev => [{
                        label: 'Subject',
                        placeholder: 'Select a subject',
                        type: 'select',
                        isSubjectField: true
                      }, ...prev]);
                    }
                  }}
                  className="w-full px-4 py-2 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface focus:outline-none focus:ring-accent focus:border-accent"
                >
                  <option value="free">Free</option>
                  <option value="plus">Plus</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
                  Tool Category
                </label>
                <select
                  value={toolCategory}
                  onChange={(e) => setToolCategory(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface focus:outline-none focus:ring-accent focus:border-accent"
                >
                  {(TOOL_CATEGORIES.filter(category => category !== 'all').map((toolCategory) => (
                    <option key={toolCategory} value={toolCategory}>{toolCategory}</option>
                  )))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
                  Navigation URL
                </label>
                <input
                  type="text"
                  value={navigation}
                  onChange={(e) => setNavigation(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface focus:outline-none focus:ring-accent focus:border-accent"
                  placeholder="Custom URL path (optional)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface focus:outline-none focus:ring-accent focus:border-accent"
                rows={3}
                placeholder="Enter tool description"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-primary-dark dark:text-dark-text">
                  Fields
                </label>
                <button
                  type="button"
                  onClick={addField}
                  className="flex items-center text-accent hover:text-accent-dark dark:text-accent dark:hover:text-accent-dark"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Field
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-sage/5 dark:bg-dark-surface rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateField(index, { label: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface focus:outline-none focus:ring-accent focus:border-accent"
                          placeholder="Field label"
                          disabled={field.isSubjectField}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
                          Placeholder
                        </label>
                        <input
                          type="text"
                          value={field.placeholder}
                          onChange={(e) => updateField(index, { placeholder: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface focus:outline-none focus:ring-accent focus:border-accent"
                          placeholder="Field placeholder"
                          disabled={field.isSubjectField}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
                          Type
                        </label>
                        <select
                          value={field.type}
                          onChange={(e) => updateField(index, { 
                            type: e.target.value as ToolField['type'],
                            options: e.target.value === 'select' && !field.isSubjectField ? [''] : undefined
                          })}
                          className="w-full px-4 py-2 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface focus:outline-none focus:ring-accent focus:border-accent"
                          disabled={field.isSubjectField}
                        >
                          <option value="input">Input</option>
                          <option value="textarea">Textarea</option>
                          <option value="select">Select</option>
                        </select>
                      </div>

                      {field.type === 'select' && !field.isSubjectField && (
                        <div>
                          <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
                            Options (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={field.options?.join(', ') || ''}
                            onChange={(e) => updateField(index, { 
                              options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                            })}
                            className="w-full px-4 py-2 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface focus:outline-none focus:ring-accent focus:border-accent"
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeField(index)}
                      className="p-2 text-accent hover:text-accent-dark dark:text-accent dark:hover:text-accent-dark"
                      disabled={field.isSubjectField}
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
                className="px-4 py-2 text-primary dark:text-dark-text-secondary hover:text-primary-dark dark:hover:text-dark-text"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}