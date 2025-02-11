import React, { useState } from 'react';
import { Building, Users, Trash2, Edit } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import type { School, User } from '../../types/admin';

interface CompanyListProps {
  schools: School[];
  onUpdate: (schools: School[]) => void;
}

export function CompanyList({ schools, onUpdate }: CompanyListProps) {
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const adminService = useAdmin();

  const handleRemoveUser = async (schoolId: string, userId: string) => {
    try {
      setLoading(true);
      await adminService.removeUser(userId);
      
      // Refresh school users
      const updatedUsers = await adminService.getSchoolUsers(schoolId);
      const updatedSchools = schools.map(school => {
        if (school.id === schoolId) {
          return {
            ...school,
            users: updatedUsers
          };
        }
        return school;
      });
      
      onUpdate(updatedSchools);
    } catch (err) {
      console.error('Error removing user:', err);
      setError('Failed to remove user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchool = async (schoolId: string) => {
    if (!window.confirm('Are you sure you want to delete this school? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      // Note: School deletion is not implemented yet in the service
      // await adminService.deleteSchool(schoolId);
      onUpdate(schools.filter(school => school.id !== schoolId));
    } catch (err) {
      console.error('Error deleting school:', err);
      setError('Failed to delete school');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      setLoading(true);
      await adminService.updateUserRole(userId, newRole);
      
      // Refresh schools data
      const updatedSchools = await adminService.getAllSchools();
      onUpdate(updatedSchools);
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  if (!schools) {
    return (
      <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-6 text-center">
        <p className="text-primary">No schools found</p>
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

      {schools.map(school => (
        <div
          key={school.id}
          className="bg-white rounded-lg shadow-soft border border-sage/10 overflow-hidden"
        >
          <div
            className="p-6 cursor-pointer hover:bg-sage/5 transition-colors duration-200"
            onClick={() => setExpandedSchool(expandedSchool === school.id ? null : school.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-mint/20 rounded-lg">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-dark">
                    {school.name}
                  </h3>
                  {school.domain && (
                    <p className="text-sm text-primary">
                      Domain: @{school.domain}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-primary">
                    {school.maxUsers} max users
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSchool(school.id);
                  }}
                  className="p-2 text-accent hover:text-accent-dark transition-colors duration-200"
                  disabled={loading}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {expandedSchool === school.id && (
            <div className="border-t border-sage/10 p-6">
              <h4 className="text-sm font-medium text-primary-dark mb-4">
                School Users
              </h4>
              <div className="space-y-4">
                {/* We'll need to fetch users for the expanded school */}
                <div className="text-center text-primary">
                  User management will be implemented in the next update
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}