import { useState } from 'react';
import { UserCircle, Trash2 } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../types/admin';

interface UserListProps {
  users: User[];
  onUpdate: (users: User[]) => void;
  onEdit: (user: User) => void;
}

export function UserList({ users, onUpdate, onEdit }: UserListProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  const adminService = useAdmin().adminService;

  const handleRemoveUser = async (userId: string) => {
    if (!userId) return;

    try {
      setLoading(true);
      await adminService.removeUser(userId);
      
      // Update local state
      const updatedUsers = users.filter(user => user.id !== userId);
      onUpdate(updatedUsers);
      setError(null);
    } catch (err) {
      console.error('Error removing user:', err);
      setError('Failed to remove user');
    } finally {
      setLoading(false);
    }
  };

  if (!users.length) {
    return (
      <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8 text-center">
        <p className="text-primary dark:text-dark-text">No users found. Add users using the button above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-coral/20 dark:bg-coral/10 border border-accent rounded-lg text-accent-dark">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border overflow-hidden">
        <div className="divide-y divide-sage/10 dark:divide-dark-border">
          {users.map((user) => (
            <div
              key={user.id || user.email}
              className="p-6 flex items-center justify-between hover:bg-sage/5 dark:hover:bg-dark-surface transition-colors duration-200 cursor-pointer"
              onClick={() => onEdit(user)}
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-mint/20 dark:bg-mint/10 rounded-lg">
                  <UserCircle className="h-5 w-5 text-primary dark:text-dark-text" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark dark:text-dark-text">
                    {user.email}
                  </h3>
                  <p className="text-sm text-primary dark:text-dark-text-secondary">
                    Role: {user.role}
                  </p>
                  {user.subjects && user.subjects.length > 0 && (
                    <p className="text-sm text-primary dark:text-dark-text-secondary mt-1">
                      Subjects: {user.subjects.length}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveUser(user.id);
                }}
                disabled={loading || user.id === currentUser?.uid}
                className="p-1.5 text-accent hover:text-accent-dark disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}