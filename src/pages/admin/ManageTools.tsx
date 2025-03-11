import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { ToolList } from '../../components/admin/tools/ToolList';
import { CreateToolModal } from '../../components/admin/tools/CreateToolModal';
import { EditToolModal } from '../../components/admin/tools/EditToolModal';
import { useManageTools } from '../../hooks/useManageTools';
import type { Tool } from '../../types';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';

export function ManageTools() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const { isOwner, loading: authLoading } = useAdmin();
  const navigate = useNavigate();
  const {
    tools,
    loading,
    error,
    successMessage,
    createTool,
    updateTool,
    deleteTool
  } = useManageTools();

  useEffect(() => {
    if (!authLoading && !isOwner) {
      navigate('/not-authorized');
    }
  }, [isOwner, authLoading, navigate]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-dark dark:text-dark-text">Manage Tools</h1>
            <p className="mt-2 text-primary dark:text-dark-text-secondary">Create and manage AI teaching tools</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300"
          >
            Create New Tool
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-coral/20 dark:bg-coral/10 border border-accent rounded-lg text-accent-dark">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-8 p-4 bg-mint/20 dark:bg-mint/10 border border-mint rounded-lg text-primary dark:text-dark-text">
            {successMessage}
          </div>
        )}

        <ToolList
          tools={tools}
          onEdit={setSelectedTool}
          onDelete={deleteTool}
        />

        <CreateToolModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={createTool}
        />

        {selectedTool && (
          <EditToolModal
            tool={selectedTool}
            onClose={() => setSelectedTool(null)}
            onSave={updateTool}
          />
        )}
      </div>
    </div>
  );
}