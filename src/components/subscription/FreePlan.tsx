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

      // Force reload to update UI
      window.location.reload();
    } catch (error) {
      console.error('Error starting trial:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-soft p-8 border border-sage/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-mint/20 rounded-lg">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-dark">Current Plan</h3>
            <p className="text-sm text-primary">Manage your subscription plan</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-mint/20 text-primary rounded-full text-sm">
          Free
        </span>
      </div>

      <div className="bg-sage/5 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xl font-semibold text-primary-dark">Free Plan</h4>
            <p className="text-primary">$0/month</p>
          </div>
          <Shield className="h-6 w-6 text-primary" />
        </div>
        
        {userProfile?.hadPreviousTrial ? (
          <div>
            <div className="mb-4 p-4 bg-coral/10 rounded-lg">
              <p className="text-accent-dark text-sm">
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