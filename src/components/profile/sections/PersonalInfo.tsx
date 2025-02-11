import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ProfilePhotoUpload } from './personal/ProfilePhotoUpload';
import { ProfileForm } from './personal/ProfileForm';
import { ProfileActions } from './personal/ProfileActions';

interface FormData {
  fullName: string;
  title: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  school: string;
  language: string;
}

export function PersonalInfo() {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!userProfile) return;

    try {
      setSaving(true);
      setError(null);

      const updates: Partial<FormData> = {};
      (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
        const newValue = formData[key].trim();
        const currentValue = userProfile[key];
        
        if (newValue !== currentValue && newValue !== '') {
          updates[key] = newValue;
        }
      });

      if (Object.keys(updates).length === 0) {
        setIsEditing(false);
        return;
      }

      await updateUserProfile(updates);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
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
    setIsEditing(false);
    setError(null);
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-primary-dark">Personal Information</h2>
        <ProfileActions
          isEditing={isEditing}
          saving={saving}
          onCancel={handleCancel}
          onSave={handleSave}
          onEdit={() => setIsEditing(true)}
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-coral/20 border border-accent rounded-lg text-accent-dark">
          {error}
        </div>
      )}

      <div className="flex items-start space-x-8 mb-8">
        <ProfilePhotoUpload
          photoURL={userProfile.photoURL}
          fullName={formData.fullName}
          email={user?.email}
          onUpload={() => {/* Photo upload functionality */}}
        />

        <ProfileForm
          formData={formData}
          handleChange={handleChange}
          isEditing={isEditing}
          saving={saving}
        />
      </div>
    </div>
  );
}