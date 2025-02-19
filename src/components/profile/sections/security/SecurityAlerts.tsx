import { AlertTriangle } from 'lucide-react';

export function SecurityAlerts() {
  return (
    <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-mint/20 dark:bg-mint/10 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary-dark dark:text-dark-text">Security Alerts</h3>
          <p className="text-sm text-primary dark:text-dark-text-secondary">Manage your security notification preferences</p>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="p-6 bg-accent/10 dark:bg-accent/5 rounded-lg border-2 border-accent/20">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-accent" />
          <div>
            <h4 className="font-medium text-accent">Coming Soon</h4>
            <p className="text-sm text-accent/80 mt-1">
              Security alerts configuration will be available in the next update. Stay tuned for enhanced security features!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}