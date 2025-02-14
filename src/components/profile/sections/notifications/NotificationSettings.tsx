import { Bell, Mail, MessageSquare, AlertTriangle, Zap } from 'lucide-react';

export function NotificationSettings() {
  // Original state commented out for future use
  /*
  const [emailNotifications, setEmailNotifications] = useState({
    accountUpdates: true,
    newFeatures: true,
    toolUpdates: false,
    marketing: false
  });

  const [pushNotifications, setPushNotifications] = useState({
    toolCompletion: true,
    securityAlerts: true,
    reminders: false,
    tips: false
  });

  const toggleEmailSetting = (key: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const togglePushSetting = (key: keyof typeof pushNotifications) => {
    setPushNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  */

  return (
      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-mint/20 rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-dark">Email Notifications</h3>
              <p className="text-sm text-primary">Manage your email preferences</p>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="p-6 bg-accent/10 rounded-lg border-2 border-accent/20">
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

          {/* Original email notifications section commented out
        <div className="space-y-4">
          {Object.entries(emailNotifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-lg border border-sage/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-mint/10 rounded-lg">
                  {key === 'accountUpdates' && <AlertTriangle className="h-5 w-5 text-primary" />}
                  {key === 'newFeatures' && <Zap className="h-5 w-5 text-primary" />}
                  {key === 'toolUpdates' && <MessageSquare className="h-5 w-5 text-primary" />}
                  {key === 'marketing' && <Mail className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <p className="font-medium text-primary-dark">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-primary">
                    {key === 'accountUpdates' && 'Important updates about your account'}
                    {key === 'newFeatures' && 'Be the first to know about new features'}
                    {key === 'toolUpdates' && 'Updates about tools you use'}
                    {key === 'marketing' && 'Promotional emails and newsletters'}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={value}
                  onChange={() => toggleEmailSetting(key as keyof typeof emailNotifications)}
                />
                <div className="w-11 h-6 bg-sage/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mint/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          ))}
        </div>
        */}
        </div>

        {/* Push Notifications */}
        <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-mint/20 rounded-lg">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-dark">Push Notifications</h3>
              <p className="text-sm text-primary">Manage your browser notifications</p>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="p-6 bg-accent/10 rounded-lg border-2 border-accent/20">
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

          {/* Original push notifications section commented out
        <div className="space-y-4">
          {Object.entries(pushNotifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-lg border border-sage/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-mint/10 rounded-lg">
                  {key === 'toolCompletion' && <Zap className="h-5 w-5 text-primary" />}
                  {key === 'securityAlerts' && <AlertTriangle className="h-5 w-5 text-primary" />}
                  {key === 'reminders' && <Bell className="h-5 w-5 text-primary" />}
                  {key === 'tips' && <MessageSquare className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <p className="font-medium text-primary-dark">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-primary">
                    {key === 'toolCompletion' && 'When your requested tools are ready'}
                    {key === 'securityAlerts' && 'Important security notifications'}
                    {key === 'reminders' && 'Daily and weekly reminders'}
                    {key === 'tips' && 'Teaching tips and best practices'}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={value}
                  onChange={() => togglePushSetting(key as keyof typeof pushNotifications)}
                />
                <div className="w-11 h-6 bg-sage/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mint/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          ))}
        </div>
        */}
        </div>
      </div>
  );
}