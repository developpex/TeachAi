import React from 'react';

interface ProfileActionsProps {
  isEditing: boolean;
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
  onEdit: () => void;
}

export function ProfileActions({
  isEditing,
  saving,
  onCancel,
  onSave,
  onEdit
}: ProfileActionsProps) {
  if (isEditing) {
    return (
      <div className="flex items-center space-x-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-dark transition-all duration-300 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onEdit}
      className="px-4 py-2 text-sm font-medium text-accent border-2 border-accent rounded-lg hover:bg-accent hover:text-white transition-all duration-300"
    >
      Edit Profile
    </button>
  );
}