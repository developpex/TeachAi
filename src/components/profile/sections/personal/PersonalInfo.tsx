import { usePersonalInfo } from '../../../../hooks/usePersonalInfo';
import { ProfileForm } from './ProfileForm';
import { ProfileActions } from './ProfileActions';

export function PersonalInfo() {
  const {
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
  } = usePersonalInfo();

  if (!userProfile) {
    return <div className="text-primary dark:text-dark-text">Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-primary-dark dark:text-dark-text mb-4 md:mb-0">Personal Information</h2>
        <ProfileActions
          isEditing={isEditing}
          saving={saving}
          onCancel={handleCancel}
          onSave={handleSave}
          onEdit={() => setIsEditing(true)}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-coral/20 border border-accent rounded-lg text-accent-dark">
          {error}
        </div>
      )}

      {/* Profile Content */}
      <div className="w-full">
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