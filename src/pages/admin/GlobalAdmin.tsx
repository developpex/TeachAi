import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Users, Plus } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { AdminService } from '../../services/admin';
import type { School } from '../../types/admin';
import { CreateSchoolModal } from '../../components/admin/CreateSchoolModal';
import { SchoolList } from '../../components/admin/SchoolList';
import {ROLE} from "../../utils/constants.ts";

export function GlobalAdmin() {
  const { isOwner, loading: authLoading } = useAdmin();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [adminCount, setAdminCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const adminService = AdminService.getInstance();

  useEffect(() => {
    if (!authLoading && !isOwner) {
      navigate('/not-authorized');
    }
  }, [isOwner, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOwner) return;

      try {
        setLoading(true);
        setError(null);
        
        // Fetch schools
        const schoolsData = await adminService.getAllSchools();
        setSchools(schoolsData);

        // Count admins across all schools
        let totalAdmins = 0;
        for (const school of schoolsData) {
          const users = await adminService.getSchoolUsers(school.id);
          totalAdmins += users.filter(user => user.role === ROLE.ADMIN).length;
        }
        setAdminCount(totalAdmins);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load schools. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOwner]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-dark">Admin</h1>
            <p className="mt-2 text-primary">Manage schools and administrators</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add School
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-coral/20 border border-accent rounded-lg text-accent-dark">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-mint/20 rounded-lg">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary-dark">Total Schools</h2>
                <p className="text-3xl font-bold text-accent mt-1">{schools.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-mint/20 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary-dark">Total Admins</h2>
                <p className="text-3xl font-bold text-accent mt-1">
                  {adminCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        <SchoolList schools={schools} onUpdate={setSchools} />
      </div>

      <CreateSchoolModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(newSchool) => {
          setSchools(prev => [...prev, newSchool]);
          setShowCreateModal(false);
        }}
      />
    </div>
  );
}