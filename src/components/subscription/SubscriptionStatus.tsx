import { useAuth } from '../../context/AuthContext.tsx';
import { FreePlan } from './FreePlan.tsx';
import { TrialPlan } from './TrialPlan.tsx';
import { PlusPlan } from './PlusPlan.tsx';
import { EnterprisePlan } from './EnterprisePlan.tsx';
import { LoadingSpinner } from '../shared/LoadingSpinner.tsx';
import { ROLE, PLAN} from "../../utils/constants.ts";

export function SubscriptionStatus() {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return (
      <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
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