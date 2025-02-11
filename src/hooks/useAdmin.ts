import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminService } from '../services/admin';
import type { School, User } from '../types/admin';

export function useAdmin() {
  const { user } = useAuth();
  const [role, setRole] = useState<'owner' | 'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const adminService = AdminService.getInstance();

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        console.log('No user found, setting role to null');
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        console.log('Checking role for user:', user.uid);
        const userRole = await adminService.getUserRole(user.uid);
        console.log('User role:', userRole);
        setRole(userRole);
      } catch (err) {
        console.error('Error checking role:', err);
        setError('Failed to check permissions');
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [user]);

  return {
    role,
    isOwner: role === 'owner',
    isAdmin: role === 'admin',
    loading,
    error,
    adminService
  };
}