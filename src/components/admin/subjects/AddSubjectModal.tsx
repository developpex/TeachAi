import { useState } from 'react';
import { X } from 'lucide-react';

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (subject: { name: string }) => void;
}

export function AddSubjectModal({ isOpen, onClose, onAdd }: AddSubjectModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Subject name is required');
      return;
    }

    onAdd({
      name: name.trim()
    });

    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-dark-nav rounded-2xl shadow-xl dark:shadow-dark-soft w-full max-w-md p-8 border border-sage/10 dark:border-dark-border">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-semibold text-primary-dark dark:text-dark-text">Add New Subject</h3>
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
            <div>
              <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
                Subject Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface focus:outline-none focus:ring-accent focus:border-accent"
                placeholder="Enter subject name"
              />
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
                className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300"
              >
                Add Subject
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}