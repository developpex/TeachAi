import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FreePlan } from './subscription/FreePlan';
import { TrialPlan } from './subscription/TrialPlan';
import { PlusPlan } from './subscription/PlusPlan';
import { EnterprisePlan } from './subscription/EnterprisePlan';
import { LoadingPlan } from './subscription/LoadingPlan';

export function SubscriptionStatus() {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return <LoadingPlan />;
  }

  // Check for enterprise plan first
  if (userProfile.plan === 'enterprise' || userProfile.role === 'owner') {
    return <EnterprisePlan />;
  }

  if (userProfile.plan === 'free') {
    return <FreePlan />;
  }

  if (userProfile.isTrialActive && userProfile.trialStartDate && userProfile.trialEndDate) {
    return (
      <TrialPlan
        trialStartDate={userProfile.trialStartDate}
        trialEndDate={userProfile.trialEndDate}
      />
    );
  }

  if (userProfile.plan === 'plus') {
    return <PlusPlan subscription={null} />;
  }

  return <FreePlan />;
}