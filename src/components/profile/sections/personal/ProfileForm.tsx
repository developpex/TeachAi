import React from 'react';
import { useAuth } from '../../../../context/AuthContext';

interface ProfileFormProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isEditing: boolean;
  saving: boolean;
}

export function ProfileForm({ formData, handleChange, isEditing, saving }: ProfileFormProps) {
  const { user } = useAuth();
  const [titlePrefix, titleName] = formData.title.split(' ');

  const inputClasses = "w-full px-4 py-3 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text placeholder-primary/50 dark:placeholder-dark-text-secondary/50 focus:outline-none focus:ring-accent focus:border-accent disabled:bg-sage/5 dark:disabled:bg-dark-surface/50 bg-white dark:bg-dark-surface";
  const selectClasses = "w-full px-4 py-3 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text focus:outline-none focus:ring-accent focus:border-accent disabled:bg-sage/5 dark:disabled:bg-dark-surface/50 bg-white dark:bg-dark-surface";

  return (
    <div className="space-y-4 w-full">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          disabled={!isEditing || saving}
          className={inputClasses}
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
          Title
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <select
            name="titlePrefix"
            value={titlePrefix || 'Ms.'}
            onChange={(e) => {
              const newTitle = `${e.target.value} ${titleName || ''}`.trim();
              handleChange({
                target: { name: 'title', value: newTitle }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            disabled={!isEditing || saving}
            className={`w-full sm:w-24 ${selectClasses}`}
          >
            <option value="Ms.">Ms.</option>
            <option value="Mr.">Mr.</option>
          </select>
          <input
            type="text"
            name="titleName"
            value={titleName || ''}
            onChange={(e) => {
              const newTitle = `${titlePrefix || 'Ms.'} ${e.target.value}`.trim();
              handleChange({
                target: { name: 'title', value: newTitle }
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            disabled={!isEditing || saving}
            placeholder="e.g., Smith, Johnson"
            className={`w-full flex-1 ${inputClasses}`}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
          Email Address
        </label>
        <input
          type="email"
          value={user?.email || ''}
          disabled
          className={`w-full px-4 py-3 border-2 border-sage/30 dark:border-dark-border rounded-lg bg-sage/5 dark:bg-dark-surface/50 text-primary-dark dark:text-dark-text`}
        />
      </div>

      {/* Two Column Grid for Remaining Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={!isEditing || saving}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={!isEditing || saving}
            className={selectClasses}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            disabled={!isEditing || saving}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
            Language
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            disabled={!isEditing || saving}
            className={selectClasses}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
            School
          </label>
          <input
            type="text"
            name="school"
            value={formData.school}
            onChange={handleChange}
            disabled={!isEditing || saving}
            className={inputClasses}
          />
        </div>
      </div>
    </div>
  );
}