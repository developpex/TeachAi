import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminService } from '../services/admin';
import {ROLE} from "../utils/constants.ts";

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
        const userRole = await adminService.getUserRole(user.uid);
        setRole(userRole);
      } catch (err) {
        console.error('Error checking role:', err);
        setError('Failed to check permissions');
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [adminService, user]);

  return {
    role,
    isOwner: role === ROLE.OWNER,
    isAdmin: role === ROLE.ADMIN,
    loading,
    error,
    adminService
  };
}