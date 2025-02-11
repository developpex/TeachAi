import React, { useState } from 'react';
import { Star, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StripeService from '../../services/stripe';
import type { SubscriptionStatus } from '../../types';
import { CancelSubscriptionModal } from './CancelSubscriptionModal';

interface PlusPlanProps {
  subscription: SubscriptionStatus | null;
}

export function PlusPlan({ subscription }: PlusPlanProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { userProfile, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const stripeService = StripeService.getInstance();

  const handleCancelSubscription = async () => {
    if (!subscription?.subscriptionId) {
      console.error('No subscription ID found');
      return;
    }

    try {
      setIsCancelling(true);
      const result = await stripeService.cancelSubscription(subscription.subscriptionId);
      
      // Update user profile with new subscription status
      await updateUserProfile({
        cancelAtPeriodEnd: true,
        currentPeriodEnd: new Date(result.currentPeriodEnd)
      });

      setShowCancelModal(false);
      window.location.reload(); // Refresh to update UI
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
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
            Active
          </span>
        </div>

        <div className="bg-sage/5 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-xl font-semibold text-primary-dark">Plus Plan</h4>
              <p className="text-primary">$29/month</p>
              {subscription && (
                <p className="text-sm text-primary/80 mt-1">
                  Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
            <Star className="h-6 w-6 text-accent fill-current" />
          </div>
          
          <div className="flex space-x-4">
            {subscription?.subscriptionId && !subscription.cancelAtPeriodEnd && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex-1 px-6 py-3 border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition-all duration-300"
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>

        {subscription?.cancelAtPeriodEnd && (
          <div className="mt-4 p-4 bg-coral/20 rounded-lg">
            <p className="text-accent-dark">
              Your subscription will be canceled on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
            <p className="text-sm text-accent-dark mt-2">
              You'll continue to have access to all features until then.
            </p>
          </div>
        )}
      </div>

      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelSubscription}
        isLoading={isCancelling}
        currentPeriodEnd={subscription?.currentPeriodEnd}
      />
    </>
  );
}