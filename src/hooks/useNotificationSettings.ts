import { useState } from 'react';

interface EmailNotifications {
  accountUpdates: boolean;
  newFeatures: boolean;
  toolUpdates: boolean;
  marketing: boolean;
}

interface PushNotifications {
  toolCompletion: boolean;
  securityAlerts: boolean;
  reminders: boolean;
  tips: boolean;
}

export function useNotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState<EmailNotifications>({
    accountUpdates: true,
    newFeatures: true,
    toolUpdates: false,
    marketing: false
  });

  const [pushNotifications, setPushNotifications] = useState<PushNotifications>({
    toolCompletion: true,
    securityAlerts: true,
    reminders: false,
    tips: false
  });

  const toggleEmailSetting = (key: keyof EmailNotifications) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const togglePushSetting = (key: keyof PushNotifications) => {
    setPushNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return {
    emailNotifications,
    pushNotifications,
    toggleEmailSetting,
    togglePushSetting
  };
}