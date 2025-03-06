import { Bell, Mail, MessageSquare, AlertTriangle, Zap } from 'lucide-react';

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-mint/20 dark:bg-mint/10 rounded-lg">
            <Mail className="h-5 w-5 text-primary dark:text-dark-text" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-dark dark:text-dark-text">Email Notifications</h3>
            <p className="text-sm text-primary dark:text-dark-text-secondary">Manage your email preferences</p>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="p-6 bg-accent/10 dark:bg-accent/5 rounded-lg border-2 border-accent/20">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-accent" />
            <div>
              <h4 className="font-medium text-accent">Coming Soon</h4>
              <p className="text-sm text-accent/80 mt-1">
                Email notification preferences will be available in the next update. Stay tuned for enhanced communication features!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-mint/20 dark:bg-mint/10 rounded-lg">
            <Bell className="h-5 w-5 text-primary dark:text-dark-text" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-dark dark:text-dark-text">Push Notifications</h3>
            <p className="text-sm text-primary dark:text-dark-text-secondary">Manage your browser notifications</p>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="p-6 bg-accent/10 dark:bg-accent/5 rounded-lg border-2 border-accent/20">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-accent" />
            <div>
              <h4 className="font-medium text-accent">Coming Soon</h4>
              <p className="text-sm text-accent/80 mt-1">
                Push notification settings will be available in the next update. We're working on bringing you real-time alerts for important updates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}