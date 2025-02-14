import { useState } from 'react';
import { UserCircle, Trash2 } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../types/admin';

interface UserListProps {
  users: User[];
  onUpdate: (users: User[]) => void;
}

export function UserList({ users, onUpdate }: UserListProps) {
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

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'user') => {
    if (!userId) return;

    try {
      setLoading(true);
      await adminService.updateUserRole(userId, newRole);
      
      // Update local state
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            role: newRole
          };
        }
        return user;
      });
      
      onUpdate(updatedUsers);
      setError(null);
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  if (!users.length) {
    return (
      <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8 text-center">
        <p className="text-primary">No users found. Add users using the button above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-coral/20 border border-accent rounded-lg text-accent-dark">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-soft border border-sage/10 overflow-hidden">
        <div className="divide-y divide-sage/10">
          {users.map((user) => (
            <div
              key={user.id || user.email} // Fallback to email if id is not available
              className="p-6 flex items-center justify-between hover:bg-sage/5 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-mint/20 rounded-lg">
                  <UserCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark">
                    {user.email}
                  </h3>
                  <p className="text-sm text-primary">
                    Role: {user.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={user.role}
                  onChange={(e) => handleUpdateRole(
                    user.id,
                    e.target.value as 'admin' | 'user'
                  )}
                  disabled={loading || user.id === currentUser?.uid}
                  className="px-3 py-1.5 border border-sage/30 rounded-lg text-sm focus:border-accent focus:ring-accent disabled:opacity-50"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                <button
                  onClick={() => handleRemoveUser(user.id)}
                  disabled={loading || user.id === currentUser?.uid}
                  className="p-1.5 text-accent hover:text-accent-dark disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}