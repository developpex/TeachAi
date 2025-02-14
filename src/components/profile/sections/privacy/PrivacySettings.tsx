import { useState } from 'react';
import { Lock, Globe, Users } from 'lucide-react';

export function PrivacySettings() {
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: true,
    thirdPartySharing: false
  });

  const handleToggle = (setting: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof privacySettings]
    }));
  };

  return (
      <div className="space-y-6">
        {/* Data Collection & Sharing */}
        <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-mint/20 rounded-lg">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-dark">Data Collection & Sharing</h3>
              <p className="text-sm text-primary">Manage how your data is collected and used</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-sage/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-mint/10 rounded-lg">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-primary-dark">Usage Data Collection</p>
                  <p className="text-sm text-primary">
                    Allow us to collect data about how you use our tools to improve your experience
                  </p>
                  <ul className="mt-2 text-sm text-primary/80 space-y-1">
                    <li>• Tool usage patterns and preferences</li>
                    <li>• Time spent on different features</li>
                    <li>• Feature interaction analytics</li>
                    <li>• Error and performance metrics</li>
                  </ul>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={privacySettings.dataCollection}
                    onChange={() => handleToggle('dataCollection')}
                />
                <div className="w-11 h-6 bg-sage/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mint/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-sage/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-mint/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-primary-dark">Third-Party Data Sharing</p>
                  <p className="text-sm text-primary">
                    Allow sharing of non-personal data with trusted partners
                  </p>
                  <ul className="mt-2 text-sm text-primary/80 space-y-1">
                    <li>• Anonymized usage statistics</li>
                    <li>• Feature popularity metrics</li>
                    <li>• Performance analytics</li>
                  </ul>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={privacySettings.thirdPartySharing}
                    onChange={() => handleToggle('thirdPartySharing')}
                />
                <div className="w-11 h-6 bg-sage/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mint/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          </div>

          <div className="mt-6 p-4 bg-mint/10 rounded-lg">
            <p className="text-sm text-primary">
              <Lock className="inline-block h-4 w-4 mr-2" />
              Your privacy is important to us. We never sell your personal data or use it for advertising purposes.
            </p>
          </div>
        </div>
      </div>
  );
}