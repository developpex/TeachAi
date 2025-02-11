import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { useAuth } from '../../context/AuthContext';
import type { User, School } from '../../types/admin';
import { AddUserModal } from '../../components/admin/AddUserModal';
import { UserList } from '../../components/admin/UserList';

export function SchoolAdmin() {
  const { role, loading, adminService } = useAdmin();
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [school, setSchool] = useState<School | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && role !== 'admin') {
      console.log('User is not an admin, redirecting...', { role });
      navigate('/not-authorized');
      return;
    }
  }, [role, loading, navigate]);

  useEffect(() => {
    const fetchSchoolData = async () => {
      if (!user) {
        console.log('No user found');
        return;
      }

      try {
        console.log('Fetching school data for user:', user.uid);
        
        // Get user document to find their school
        const userDoc = await adminService.getUserById(user.uid);
        console.log('User document:', userDoc);
        
        if (!userDoc) {
          console.log('User data not found');
          setError('User data not found');
          setLoadingData(false);
          return;
        }

        if (!userDoc.schoolId) {
          console.log('No school ID found for user');
          setError('No school associated with this user');
          setLoadingData(false);
          return;
        }

        // Get school details
        const schoolDoc = await adminService.getSchoolById(userDoc.schoolId);
        console.log('School document:', schoolDoc);
        
        if (!schoolDoc) {
          console.log('School data not found');
          setError('School data not found');
          setLoadingData(false);
          return;
        }

        setSchool(schoolDoc);

        // Get school users
        const schoolUsers = await adminService.getSchoolUsers(userDoc.schoolId);
        console.log('School users:', schoolUsers);
        setUsers(schoolUsers);
      } catch (err) {
        console.error('Error fetching school data:', err);
        setError('Failed to load school data');
      } finally {
        setLoadingData(false);
      }
    };

    if (user && role === 'admin') {
      console.log('User is admin, fetching school data...');
      fetchSchoolData();
    }
  }, [user, role, adminService]);

  const handleAddUser = async (newUser: User) => {
    if (!school) return;

    try {
      // Check user limit
      if (users.length >= school.maxUsers) {
        setError('Cannot add more users. User limit reached.');
        return;
      }

      setUsers(prev => [...prev, newUser]);
      setShowAddModal(false);
      setError(null);
    } catch (err) {
      console.error('Error adding user:', err);
      setError('Failed to add user');
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8 text-center">
            <h2 className="text-xl font-semibold text-primary-dark mb-4">No School Found</h2>
            <p className="text-primary">
              {error || 'You are not associated with any school. Please contact your administrator.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-dark">School Admin</h1>
            <p className="mt-2 text-primary">Manage users for {school.name}</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={users.length >= school.maxUsers}
            className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-coral/20 border border-accent rounded-lg text-accent-dark">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-6 mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-mint/20 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-dark">Users</h2>
              <p className="text-primary">
                {users.length} of {school.maxUsers} users
              </p>
            </div>
          </div>
        </div>

        <UserList users={users} onUpdate={setUsers} />
      </div>

      {school && (
        <AddUserModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddUser}
          schoolId={school.id}
        />
      )}
    </div>
  );
}