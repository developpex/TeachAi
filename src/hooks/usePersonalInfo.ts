import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { EmailService } from '../services/email';
import type { FormData } from '../types/profile';

export function usePersonalInfo() {
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
  const emailService = EmailService.getInstance();

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
    if (!userProfile || !user) return;

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

      // Update profile
      await updateUserProfile(updates);

      // Send email notification
      await emailService.sendProfileUpdateEmail(user.uid, updates);

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

  return {
    user,
    userProfile,
    formData,
    isEditing,
    saving,
    error,
    handleChange,
    handleSave,
    handleCancel,
    setIsEditing
  };
}