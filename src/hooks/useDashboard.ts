import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StripeService from '../services/stripe';

export function useDashboard() {
  const { userProfile, updateUserProfile, user } = useAuth();
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const stripeService = StripeService.getInstance();

  useEffect(() => {
    if (userProfile && !userProfile.isProfileComplete) {
      setShowTeacherModal(true);
    }
  }, [userProfile]);

  const handleTeacherInfo = async (fullName: string, title: string) => {
    if (!user) return;

    try {
      await updateUserProfile({
        ...userProfile!,
        fullName,
        title,
        isProfileComplete: true
      });
      setShowTeacherModal(false);
    } catch (error) {
      console.error('Error saving teacher profile:', error);
    }
  };

  const updateSubscriptionDetails = async (subscriptionDetails: any) => {
    if (!subscriptionDetails) return;

    try {
      const now = new Date();
      await updateUserProfile({
        plan: 'plus',
        isTrialActive: false,
        trialStartDate: null,
        trialEndDate: null,
        stripeSubscriptionId: subscriptionDetails.subscriptionId,
        subscriptionStartDate: now,
        currentPeriodEnd: new Date(subscriptionDetails.currentPeriodEnd),
        cancelAtPeriodEnd: subscriptionDetails.cancelAtPeriodEnd || false,
        cardDetails: subscriptionDetails.cardDetails ? {
          brand: subscriptionDetails.cardDetails.brand,
          last4: subscriptionDetails.cardDetails.last4,
          expMonth: subscriptionDetails.cardDetails.expMonth,
          expYear: subscriptionDetails.cardDetails.expYear
        } : null,
        subscriptionStatus: subscriptionDetails.status,
        lastPaymentDate: now,
        nextPaymentDate: new Date(subscriptionDetails.currentPeriodEnd),
        billingHistory: subscriptionDetails.billingHistory || []
      });
    } catch (error) {
      console.error('Error updating subscription details:', error);
      throw new Error('Failed to update subscription details');
    }
  };

  useEffect(() => {
    const handleSubscriptionSetup = async () => {
      if (!user) return;

      try {
        setSubscriptionLoading(true);
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');

        if (sessionId) {
          const session = await stripeService.getCheckoutSession(sessionId);
          if (session?.subscription) {
            const subscriptionDetails = await stripeService.getSubscriptionStatus(session.subscription);
            if (subscriptionDetails) {
              await updateSubscriptionDetails(subscriptionDetails);
            }
          }
          window.history.replaceState({}, document.title, '/dashboard');
        } 
        else if (userProfile?.stripeSubscriptionId) {
          const subscriptionDetails = await stripeService.getSubscriptionStatus(userProfile.stripeSubscriptionId);
          if (subscriptionDetails) {
            await updateSubscriptionDetails(subscriptionDetails);
          }
        }
      } catch (error: any) {
        console.error('Error handling subscription setup:', error);
      } finally {
        setSubscriptionLoading(false);
      }
    };

    handleSubscriptionSetup();
  }, [location.search, userProfile?.stripeSubscriptionId, user]);

  return {
    showTeacherModal,
    setShowTeacherModal,
    handleTeacherInfo,
    subscriptionLoading,
    userProfile,
    navigate
  };
}