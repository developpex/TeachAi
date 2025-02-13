import { useState, useEffect } from 'react';
import { ToolService } from '../services/tools';
import type { Tool, ToolField } from '../types';

export function useManageTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const toolService = ToolService.getInstance();

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      setLoading(true);
      const fetchedTools = await toolService.getAllTools();
      setTools(fetchedTools);
      setError(null);
    } catch (err) {
      console.error('Error loading tools:', err);
      setError('Failed to load tools');
    } finally {
      setLoading(false);
    }
  };

  const createTool = async (tool: Omit<Tool, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newToolId = await toolService.createTool(tool);
      await loadTools();
      setSuccessMessage('Tool created successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      return newToolId;
    } catch (err) {
      console.error('Error creating tool:', err);
      setError(err instanceof Error ? err.message : 'Failed to create tool');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTool = async (id: string, updates: Partial<Tool>) => {
    try {
      setLoading(true);
      setError(null);
      await toolService.updateTool(id, updates);
      await loadTools();
      setSuccessMessage('Tool updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error updating tool:', err);
      setError(err instanceof Error ? err.message : 'Failed to update tool');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTool = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await toolService.deleteTool(id);
      await loadTools();
      setSuccessMessage('Tool deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting tool:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete tool');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tools,
    loading,
    error,
    successMessage,
    createTool,
    updateTool,
    deleteTool,
    refreshTools: loadTools
  };
}