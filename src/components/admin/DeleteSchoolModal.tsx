import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  schoolName: string;
  isLoading: boolean;
}

export function DeleteSchoolModal({ isOpen, onClose, onConfirm, schoolName, isLoading }: DeleteSchoolModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-sage/10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-coral/10 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold text-primary-dark">Delete School</h3>
            </div>
            <button onClick={onClose} className="text-primary hover:text-primary-dark">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-8">
            <p className="text-primary mb-4">
              Are you sure you want to delete <span className="font-semibold">{schoolName}</span>?
              This action cannot be undone.
            </p>
            <div className="bg-coral/10 p-4 rounded-lg">
              <p className="text-accent-dark text-sm">
                This will permanently delete:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-accent-dark">
                <li>• All school data and settings</li>
                <li>• All associated user accounts</li>
                <li>• All user data and content</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Deleting...' : 'Yes, Delete School'}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full px-6 py-3 border-2 border-sage/30 text-primary rounded-lg hover:bg-sage/5 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}