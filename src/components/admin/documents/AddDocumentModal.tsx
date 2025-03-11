import { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import type { Subject } from '../../../types';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, subjectId: string) => Promise<void>;
  subjects: Subject[];
  uploading: boolean;
}

export function AddDocumentModal({ isOpen, onClose, onUpload, subjects, uploading }: AddDocumentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [subjectId, setSubjectId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file || !subjectId) {
      setError('Please select both a file and a subject');
      return;
    }

    try {
      await onUpload(file, subjectId);
      setFile(null);
      setSubjectId('');
      onClose();
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-dark-nav rounded-2xl shadow-xl dark:shadow-dark-soft w-full max-w-md p-8 border border-sage/10 dark:border-dark-border">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-semibold text-primary-dark dark:text-dark-text">Upload Document</h3>
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
                Select Document (PDF)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex items-center justify-between p-4 border-2 border-dashed border-sage/30 dark:border-dark-border rounded-lg bg-sage/5 dark:bg-dark-surface">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-mint/20 dark:bg-mint/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary dark:text-dark-text" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary-dark dark:text-dark-text">
                        {file ? file.name : 'Choose a PDF file'}
                      </p>
                      {!file && (
                        <p className="text-xs text-primary/60 dark:text-dark-text-secondary">
                          Click or drag and drop
                        </p>
                      )}
                    </div>
                  </div>
                  {!file && (
                    <div className="p-2 bg-mint/10 dark:bg-mint/5 rounded-lg">
                      <Upload className="h-4 w-4 text-primary dark:text-dark-text" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
                Select Subject
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface focus:outline-none focus:ring-accent focus:border-accent"
              >
                <option value="">Select a subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-primary dark:text-dark-text hover:text-primary-dark dark:hover:text-white"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading || !file}
                className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 disabled:opacity-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}