import React, { useState } from 'react';
import { X, Mail, Bell, MessageSquare } from 'lucide-react';

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

interface SecurityAlertModalProps {
  alert: SecurityAlert;
  onClose: () => void;
  onSave: (alert: SecurityAlert) => void;
}

export function SecurityAlertModal({ alert, onClose, onSave }: SecurityAlertModalProps) {
  const [enabled, setEnabled] = useState(alert.enabled);
  const [options, setOptions] = useState(alert.options || {
    email: false,
    push: false,
    sms: false
  });

  const handleSave = () => {
    onSave({
      ...alert,
      enabled,
      options: enabled ? options : undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-sage/10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-primary-dark">{alert.title}</h3>
              <p className="mt-1 text-sm text-primary">{alert.description}</p>
            </div>
            <button onClick={onClose} className="text-primary hover:text-primary-dark">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-primary-dark font-medium">Enable alerts</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                />
                <div className="w-11 h-6 bg-sage/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mint/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>

            {enabled && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-sage/20">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-mint/10 rounded-lg">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-primary-dark">Email notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={options.email}
                      onChange={(e) => setOptions(prev => ({ ...prev, email: e.target.checked }))}
                    />
                    <div className="w-11 h-6 bg-sage/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mint/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-sage/20">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-mint/10 rounded-lg">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-primary-dark">Push notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={options.push}
                      onChange={(e) => setOptions(prev => ({ ...prev, push: e.target.checked }))}
                    />
                    <div className="w-11 h-6 bg-sage/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mint/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-sage/20">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-mint/10 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-primary-dark">SMS notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={options.sms}
                      onChange={(e) => setOptions(prev => ({ ...prev, sms: e.target.checked }))}
                    />
                    <div className="w-11 h-6 bg-sage/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mint/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-dark transition-all duration-300"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}