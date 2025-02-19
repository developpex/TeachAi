import { Shield, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SubscribeButton } from './SubscribeButton';

export function FreePlan() {
  const { userProfile, updateUserProfile } = useAuth();

  const handleStartTrial = async () => {
    try {
      const trialStartDate = new Date();
      const trialEndDate = new Date(trialStartDate);
      trialEndDate.setDate(trialStartDate.getDate() + 30); // 30-day trial

      await updateUserProfile({
        plan: 'plus',
        isTrialActive: true,
        trialStartDate,
        trialEndDate,
        hadPreviousTrial: false
      });

      window.location.reload();
    } catch (error) {
      console.error('Error starting trial:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-mint/20 dark:bg-mint/10 rounded-lg">
            <Package className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-dark dark:text-dark-text">Current Plan</h3>
            <p className="text-sm text-primary dark:text-dark-text-secondary">Manage your subscription plan</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-mint/20 dark:bg-mint/10 text-primary dark:text-dark-text rounded-full text-sm">
          Free
        </span>
      </div>

      <div className="bg-sage/5 dark:bg-dark-surface rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xl font-semibold text-primary-dark dark:text-dark-text">Free Plan</h4>
            <p className="text-primary dark:text-dark-text-secondary">$0/month</p>
          </div>
          <Shield className="h-6 w-6 text-accent" />
        </div>
        
        {userProfile?.hadPreviousTrial ? (
          <div>
            <div className="mb-4 p-4 bg-coral/20 dark:bg-coral/10 rounded-lg">
              <p className="text-accent-dark">
                You've already used your free trial. Subscribe now to access all Plus features.
              </p>
            </div>
            <SubscribeButton />
          </div>
        ) : (
          <button
            onClick={handleStartTrial}
            className="w-full mt-4 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300"
          >
            Start Free Trial
          </button>
        )}
      </div>
    </div>
  );
}