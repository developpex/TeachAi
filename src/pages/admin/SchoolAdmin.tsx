import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { SchoolAdminNavigation } from '../../components/admin/navigation/SchoolAdminNavigation';
import { ManageUsers } from './sections/ManageUsers';
import { ManageSubjects } from './sections/ManageSubjects';
import { ManageDocuments } from './sections/ManageDocuments';
import { ROLE } from "../../utils/constants";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";

export function SchoolAdmin() {
  const { role, loading: authLoading } = useAdmin();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && role !== ROLE.ADMIN) {
      console.log('User is not an admin, redirecting...', { role });
      navigate('/not-authorized');
      return;
    }
  }, [role, authLoading, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-dark-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Header */}
        {isMobile && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary-dark dark:text-dark-text">School Admin</h1>
            <p className="text-primary dark:text-dark-text-secondary">Manage your school settings</p>
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <SchoolAdminNavigation />
          </div>
          
          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <Routes>
              <Route path="/" element={<Navigate to="users" replace />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="subjects" element={<ManageSubjects />} />
              <Route path="documents" element={<ManageDocuments />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}