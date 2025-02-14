import { useState } from 'react';
import { Building, Users, Trash2, Edit, X, Save, Search } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import type { School, User } from '../../types/admin';
import { DeleteSchoolModal } from './DeleteSchoolModal';

interface SchoolListProps {
  schools: School[];
  onUpdate: (schools: School[]) => void;
}

export function SchoolList({ schools, onUpdate }: SchoolListProps) {
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null);
  const [schoolUsers, setSchoolUsers] = useState<Record<string, User[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingMaxUsers, setEditingMaxUsers] = useState<string | null>(null);
  const [newMaxUsers, setNewMaxUsers] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);
  const { adminService } = useAdmin();

  const handleSchoolClick = async (schoolId: string) => {
    try {
      if (expandedSchool === schoolId) {
        setExpandedSchool(null);
        return;
      }

      setExpandedSchool(schoolId);
      setLoading(true);
      setError(null);

      // Only fetch users if we haven't already
      if (!schoolUsers[schoolId]) {
        const users = await adminService.getSchoolUsers(schoolId);
        setSchoolUsers(prev => ({
          ...prev,
          [schoolId]: users
        }));
      }
    } catch (err) {
      console.error('Error fetching school users:', err);
      setError('Failed to load school users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMaxUsers = async (schoolId: string) => {
    if (newMaxUsers < 1) {
      setError('User limit must be at least 1');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await adminService.updateSchoolMaxUsers(schoolId, newMaxUsers);
      
      // Update local state
      onUpdate(schools.map(school => 
        school.id === schoolId 
          ? { ...school, maxUsers: newMaxUsers }
          : school
      ));
      
      setEditingMaxUsers(null);
    } catch (err) {
      console.error('Error updating max users:', err);
      setError('Failed to update user limit');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchool = async () => {
    if (!schoolToDelete) return;

    try {
      setLoading(true);
      setError(null);
      await adminService.deleteSchool(schoolToDelete.id);
      onUpdate(schools.filter(school => school.id !== schoolToDelete.id));
      setSchoolToDelete(null);
    } catch (err) {
      console.error('Error deleting school:', err);
      setError('Failed to delete school and its users');
    } finally {
      setLoading(false);
    }
  };

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.domain?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!schools?.length) {
    return (
      <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-6 text-center">
        <p className="text-primary">No schools found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/60" />
        <input
          type="text"
          placeholder="Search schools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border-2 border-sage/30 rounded-lg text-primary-dark placeholder-primary/50 focus:outline-none focus:ring-accent focus:border-accent"
        />
      </div>

      {error && (
        <div className="p-4 bg-coral/20 border border-accent rounded-lg text-accent-dark">
          {error}
        </div>
      )}

      {filteredSchools.map(school => (
        <div
          key={school.id}
          className="bg-white rounded-lg shadow-soft border border-sage/10 overflow-hidden"
        >
          <div 
            className="p-6 cursor-pointer hover:bg-sage/5 transition-colors duration-200"
            onClick={() => handleSchoolClick(school.id)}
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
                  {editingMaxUsers === school.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        value={newMaxUsers}
                        onChange={(e) => setNewMaxUsers(parseInt(e.target.value))}
                        onClick={(e) => e.stopPropagation()}
                        className="w-20 px-2 py-1 border border-sage/30 rounded-lg text-sm"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateMaxUsers(school.id);
                        }}
                        className="p-1 text-mint hover:text-primary transition-colors duration-200"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingMaxUsers(null);
                        }}
                        className="p-1 text-accent hover:text-accent-dark transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-primary">{school.maxUsers} max users</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingMaxUsers(school.id);
                          setNewMaxUsers(school.maxUsers);
                        }}
                        className="p-1 text-primary hover:text-primary-dark transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSchoolToDelete(school);
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
              
              {loading ? (
                <div className="text-center py-4">
                  <p className="text-primary">Loading users...</p>
                </div>
              ) : schoolUsers[school.id]?.length ? (
                <div className="space-y-4">
                  {schoolUsers[school.id].map(user => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-sage/5 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-mint/10 rounded-lg">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-primary-dark">{user.email}</p>
                          <p className="text-sm text-primary capitalize">{user.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-primary">No users found for this school</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <DeleteSchoolModal
        isOpen={!!schoolToDelete}
        onClose={() => setSchoolToDelete(null)}
        onConfirm={handleDeleteSchool}
        schoolName={schoolToDelete?.name || ''}
        isLoading={loading}
      />
    </div>
  );
}