import React from 'react';

interface ProfileHeaderProps {
  isMobile: boolean;
}

export function ProfileHeader({ isMobile }: ProfileHeaderProps) {
  if (!isMobile) return null;

  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold text-primary-dark">Profile Settings</h1>
      <p className="text-primary">Manage your account preferences</p>
    </div>
  );
}