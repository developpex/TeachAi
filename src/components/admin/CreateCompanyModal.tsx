import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import type { School } from '../../types/admin';

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (school: School) => void;
}

export function CreateCompanyModal({ isOpen, onClose, onSuccess }: CreateCompanyModalProps) {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [maxUsers, setMaxUsers] = useState(10); // Default limit
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const adminService = useAdmin();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const trimmedName = name.trim();
    const trimmedEmail = adminEmail.trim();
    const trimmedDomain = domain.trim();

    if (!trimmedName) {
      setError('School name is required');
      return;
    }

    if (!trimmedEmail) {
      setError('Admin email is required');
      return;
    }

    if (!trimmedEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (trimmedDomain && !trimmedDomain.match(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)) {
      setError('Please enter a valid domain (e.g., school.edu)');
      return;
    }

    if (maxUsers < 1) {
      setError('User limit must be at least 1');
      return;
    }

    try {
      setLoading(true);
      const schoolId = await adminService.createSchool({
        name: trimmedName,
        domain: trimmedDomain || undefined,
        adminEmail: trimmedEmail,
        maxUsers
      });

      const school = await adminService.getSchoolById(schoolId);
      if (school) {
        onSuccess(school);
        setName('');
        setDomain('');
        setAdminEmail('');
        setMaxUsers(10);
      } else {
        throw new Error('Failed to retrieve created school');
      }
    } catch (err) {
      console.error('Error creating school:', err);
      setError(err instanceof Error ? err.message : 'Failed to create school');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-sage/10">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-semibold text-primary-dark">Add New School</h3>
            <button onClick={onClose} className="text-primary hover:text-primary-dark">
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-coral/20 border border-accent rounded-lg text-accent-dark">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1">
                School Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
                placeholder="Enter school name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1">
                Domain (Optional)
              </label>
              <div className="flex items-center">
                <span className="text-primary mr-2">@</span>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="flex-1 px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
                  placeholder="school.edu"
                />
              </div>
              <p className="mt-1 text-sm text-primary">
                Used to restrict email signups to this domain
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
                placeholder="Enter admin email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-1">
                User Limit
              </label>
              <input
                type="number"
                min="1"
                value={maxUsers}
                onChange={(e) => setMaxUsers(parseInt(e.target.value))}
                className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
                placeholder="Enter user limit"
              />
              <p className="mt-1 text-sm text-primary">
                Maximum number of users allowed for this school
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-primary hover:text-primary-dark"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create School'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}