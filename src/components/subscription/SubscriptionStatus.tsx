import { useAuth } from '../../context/AuthContext.tsx';
import { FreePlan } from './FreePlan.tsx';
import { TrialPlan } from './TrialPlan.tsx';
import { PlusPlan } from './PlusPlan.tsx';
import { EnterprisePlan } from './EnterprisePlan.tsx';
import { LoadingPlan } from './LoadingPlan.tsx';
import { ROLE, PLAN} from "../../utils/constants.ts";

export function SubscriptionStatus() {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return <LoadingPlan />;
  }

  // Check for enterprise plan first
  if (userProfile.plan === PLAN.ENTERPRISE || userProfile.role === ROLE.OWNER) {
    return <EnterprisePlan />;
  }

  if (userProfile.plan === PLAN.FREE) {
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

  if (userProfile.plan === PLAN.PLUS) {
    return <PlusPlan subscription={null} />;
  }

  return <FreePlan />;
}