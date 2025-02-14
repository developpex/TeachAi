import { Routes, Route, Navigate } from 'react-router-dom';
import { ProfileNavigation } from '../components/navigation/ProfileNavigation.tsx';
import { PersonalInfo } from '../components/profile/sections/personal/PersonalInfo';
import { AccountSettings } from '../components/profile/sections/account/AccountSettings';
import { SecuritySettings } from '../components/profile/sections/security/SecuritySettings';
import { SubscriptionSettings } from '../components/profile/sections/subscription/SubscriptionSettings';
import { ActivityHistory } from '../components/profile/sections/activity/ActivityHistory';
import { NotificationSettings } from '../components/profile/sections/notifications/NotificationSettings';
import { PrivacySettings } from '../components/profile/sections/privacy/PrivacySettings';
import { Support } from '../components/profile/sections/support/Support';
import { Help } from '../components/profile/sections/help/Help.tsx';
import { useProfile } from '../hooks/useProfile';

export function Profile() {
  const { isMobile } = useProfile();

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Header */}
        {isMobile && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary-dark">Profile Settings</h1>
            <p className="text-primary">Manage your account preferences</p>
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <ProfileNavigation />
          </div>
          
          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <Routes>
              <Route path="/" element={<Navigate to="/profile/personal" replace />} />
              <Route path="/personal" element={<PersonalInfo />} />
              <Route path="/account" element={<AccountSettings />} />
              <Route path="/security" element={<SecuritySettings />} />
              <Route path="/subscription" element={<SubscriptionSettings />} />
              <Route path="/activity" element={<ActivityHistory />} />
              <Route path="/notifications" element={<NotificationSettings />} />
              <Route path="/privacy" element={<PrivacySettings />} />
              <Route path="/help" element={<Help />} />
              <Route path="/support" element={<Support />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}