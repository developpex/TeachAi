import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export function PersonalInfo() {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    school: '',
    language: 'en'
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullName || '',
        title: userProfile.title || '',
        phoneNumber: userProfile.phoneNumber || '',
        dateOfBirth: userProfile.dateOfBirth || '',
        gender: userProfile.gender || '',
        school: userProfile.school || '',
        language: userProfile.language || 'en'
      });
    }
  }, [userProfile]);

  const handleSubmit = async () => {
    if (!userProfile) return;

    try {
      setSaving(true);
      setError(null);

      const updates = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value.trim() !== userProfile[key]) {
          acc[key] = value.trim();
        }
        return acc;
      }, {} as Record<string, string>);

      if (Object.keys(updates).length > 0) {
        await updateUserProfile(updates);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-primary-dark mb-4 md:mb-0">Personal Information</h2>
        <div className="flex items-center space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-dark transition-all duration-300"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-accent border-2 border-accent rounded-lg hover:bg-accent hover:text-white transition-all duration-300"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-coral/20 border border-accent rounded-lg text-accent-dark">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-primary-dark mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            disabled={!isEditing || saving}
            className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent disabled:bg-sage/5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark mb-1">
            Title
          </label>
          <div className="flex space-x-3">
            <select
              value={formData.title.split(' ')[0] || 'Ms.'}
              onChange={(e) => {
                const [_, name] = formData.title.split(' ');
                setFormData(prev => ({
                  ...prev,
                  title: `${e.target.value} ${name || ''}`
                }));
              }}
              disabled={!isEditing || saving}
              className="w-24 px-3 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent disabled:bg-sage/5"
            >
              <option value="Ms.">Ms.</option>
              <option value="Mr.">Mr.</option>
            </select>
            <input
              type="text"
              value={formData.title.split(' ').slice(1).join(' ')}
              onChange={(e) => {
                const prefix = formData.title.split(' ')[0] || 'Ms.';
                setFormData(prev => ({
                  ...prev,
                  title: `${prefix} ${e.target.value}`
                }));
              }}
              disabled={!isEditing || saving}
              placeholder="e.g., Smith, Johnson"
              className="flex-1 px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent disabled:bg-sage/5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg bg-sage/5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
            disabled={!isEditing || saving}
            className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent disabled:bg-sage/5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            disabled={!isEditing || saving}
            className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent disabled:bg-sage/5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark mb-1">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
            disabled={!isEditing || saving}
            className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent disabled:bg-sage/5"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark mb-1">
            Language
          </label>
          <select
            value={formData.language}
            onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
            disabled={!isEditing || saving}
            className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent disabled:bg-sage/5"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark mb-1">
            School
          </label>
          <input
            type="text"
            value={formData.school}
            onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
            disabled={!isEditing || saving}
            className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent disabled:bg-sage/5"
          />
        </div>
      </div>
    </div>
  );
}