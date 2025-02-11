import { useState } from 'react';

interface PrivacySettings {
  profileVisibility: 'public' | 'authenticated' | 'private';
  activityVisibility: 'public' | 'authenticated' | 'private';
  toolsVisibility: 'public' | 'authenticated' | 'private';
  dataCollection: boolean;
  thirdPartySharing: boolean;
}

export function usePrivacySettings() {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'authenticated',
    activityVisibility: 'private',
    toolsVisibility: 'public',
    dataCollection: true,
    thirdPartySharing: false
  });

  const handleVisibilityChange = (setting: keyof Pick<PrivacySettings, 'profileVisibility' | 'activityVisibility' | 'toolsVisibility'>, value: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleToggle = (setting: keyof Pick<PrivacySettings, 'dataCollection' | 'thirdPartySharing'>) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return {
    privacySettings,
    handleVisibilityChange,
    handleToggle
  };
}