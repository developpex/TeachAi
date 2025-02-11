import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { SecurityAlertModal } from './SecurityAlertModal';

interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  options?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export function SecurityAlerts() {
  // Original alerts state commented out for future use
  /*
  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: 'account-settings',
      title: 'Changes to account settings',
      description: 'Get notified when important account settings are modified',
      enabled: true,
      options: {
        email: true,
        push: true,
        sms: false
      }
    },
    {
      id: 'password-changes',
      title: 'Password changes',
      description: 'Get notified when your password is changed',
      enabled: true,
      options: {
        email: true,
        push: true,
        sms: false
      }
    }
  ]);

  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);

  const handleUpdateAlert = (updatedAlert: SecurityAlert) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === updatedAlert.id ? updatedAlert : alert
    ));
    setSelectedAlert(null);
  };
  */

  return (
    <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-mint/20 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary-dark">Security Alerts</h3>
          <p className="text-sm text-primary">Manage your security notification preferences</p>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="p-6 bg-accent/10 rounded-lg border-2 border-accent/20">
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

      {/* Original alerts section commented out
      <div className="space-y-4">
        {alerts.map(alert => (
          <div key={alert.id} className="flex items-center justify-between p-4 rounded-lg border border-sage/20">
            <div className="flex-1">
              <h4 className="font-medium text-primary-dark">{alert.title}</h4>
              <p className="text-sm text-primary mt-1">{alert.description}</p>
              {alert.enabled && alert.options && (
                <div className="flex items-center space-x-3 mt-2">
                  {alert.options.email && (
                    <span className="text-xs bg-mint/20 text-primary px-2 py-1 rounded-full">
                      Email
                    </span>
                  )}
                  {alert.options.push && (
                    <span className="text-xs bg-mint/20 text-primary px-2 py-1 rounded-full">
                      Push
                    </span>
                  )}
                  {alert.options.sms && (
                    <span className="text-xs bg-mint/20 text-primary px-2 py-1 rounded-full">
                      SMS
                    </span>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedAlert(alert)}
              className="ml-4 text-sm text-accent hover:text-accent-dark"
            >
              Configure
            </button>
          </div>
        ))}
      </div>

      {selectedAlert && (
        <SecurityAlertModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onSave={handleUpdateAlert}
        />
      )}
      */}
    </div>
  );
}