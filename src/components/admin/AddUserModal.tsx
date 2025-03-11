import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { UserService } from '../../services/user';
import { SubjectService } from '../../services/subject';
import type { Subject } from '../../types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  schoolId: string;
  editUser?: any; // Add this prop for editing
}

export function AddUserModal({ isOpen, onClose, onSuccess, schoolId, editUser }: AddUserModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const userService = UserService.getInstance();
  const subjectService = SubjectService.getInstance();

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const subjects = await subjectService.getSchoolSubjects(schoolId);
        setAvailableSubjects(subjects);
      } catch (err) {
        console.error('Error loading subjects:', err);
        setError('Failed to load subjects');
      }
    };

    if (isOpen) {
      loadSubjects();
    }
  }, [isOpen, schoolId]);

  useEffect(() => {
    if (editUser) {
      setEmail(editUser.email);
      setRole(editUser.role);
      setSelectedSubjects(editUser.subjects || []);
    }
  }, [editUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      setLoading(true);
      if (editUser) {
        // Update existing user
        await userService.updateUserRole(editUser.id, role);
        await userService.updateUserSubjects(editUser.id, selectedSubjects);
      } else {
        // Add new user
        await userService.addUser({
          email: email.trim(),
          role,
          schoolId,
          subjects: selectedSubjects
        });
      }
      
      onSuccess({
        email: email.trim(),
        role,
        schoolId,
        subjects: selectedSubjects
      });
      setEmail('');
      setRole('user');
      setSelectedSubjects([]);
    } catch (err) {
      console.error('Error managing user:', err);
      setError(err instanceof Error ? err.message : 'Failed to manage user');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-dark-nav rounded-2xl shadow-xl dark:shadow-dark-soft w-full max-w-md p-8 border border-sage/10 dark:border-dark-border">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-semibold text-primary-dark dark:text-dark-text">
              {editUser ? 'Edit User' : 'Add New User'}
            </h3>
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
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!editUser}
                className="w-full px-4 py-3 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface focus:outline-none focus:ring-accent focus:border-accent"
                placeholder="Enter user email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
                className="w-full px-4 py-3 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface focus:outline-none focus:ring-accent focus:border-accent"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-2">
                Subjects
              </label>
              <div className="space-y-3">
                {availableSubjects.map(subject => (
                  <div key={subject.id} className="flex items-center justify-between p-3 bg-sage/5 dark:bg-dark-surface rounded-lg">
                    <span className="text-primary dark:text-dark-text">{subject.name}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject.id)}
                        onChange={() => handleSubjectToggle(subject.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-sage/30 dark:bg-dark-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mint/20 dark:peer-focus:ring-mint/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-primary dark:text-dark-text hover:text-primary-dark dark:hover:text-white"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-dark transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (editUser ? 'Updating...' : 'Adding...') : (editUser ? 'Update User' : 'Add User')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}