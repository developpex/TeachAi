import { useState, useEffect } from 'react';
import { UserList } from '../../../components/admin/UserList';
import { AddUserModal } from '../../../components/admin/AddUserModal';
import { UserPlus } from 'lucide-react';
import { useAdmin } from '../../../hooks/useAdmin';
import { auth } from '../../../config/firebase';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import type { User } from '../../../types/admin';

export function ManageUsers() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { adminService } = useAdmin();

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (!auth.currentUser) return;
        
        // Get the admin's user document to get their school ID
        const userDoc = await adminService.getUserById(auth.currentUser.uid);
        if (!userDoc?.schoolId) {
          setError('No school associated with this user');
          setLoading(false);
          return;
        }

        setSchoolId(userDoc.schoolId);

        // Get school users
        const schoolUsers = await adminService.getSchoolUsers(userDoc.schoolId);
        setUsers(schoolUsers);
      } catch (err) {
        console.error('Error initializing data:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [adminService]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowAddModal(true);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!schoolId) {
    return (
      <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8">
        <div className="text-center text-primary dark:text-dark-text">
          {error || 'Unable to load school information'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-mint/20 dark:bg-mint/10 rounded-lg">
            <UserPlus className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary-dark dark:text-dark-text">Manage Users</h2>
            <p className="text-sm text-primary dark:text-dark-text-secondary">Add and manage school users</p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedUser(null);
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300"
        >
          Add User
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-coral/20 dark:bg-coral/10 border border-accent rounded-lg text-accent-dark">
          {error}
        </div>
      )}

      <UserList 
        users={users} 
        onUpdate={setUsers} 
        onEdit={handleEditUser}
      />

      {showAddModal && (
        <AddUserModal
          isOpen={true}
          onClose={() => {
            setShowAddModal(false);
            setSelectedUser(null);
          }}
          onSuccess={(user) => {
            if (selectedUser) {
              setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...user } : u));
            } else {
              setUsers(prev => [...prev, user]);
            }
            setShowAddModal(false);
            setSelectedUser(null);
          }}
          schoolId={schoolId}
          editUser={selectedUser}
        />
      )}
    </div>
  );
}