import { ToolGrid } from '../components/tools/ToolGrid';
import { useTools } from '../hooks/useTools';
import { useDashboard } from '../hooks/useDashboard';
import { TeacherInfoModal } from '../components/TeacherInfoModal';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { UsageLimitBanner } from '../components/tools/UsageLimitBanner';
import { useToolUsage } from '../hooks/useToolUsage';
import { PLAN } from '../utils/constants';
import {LoadingSpinner} from "../components/shared/LoadingSpinner.tsx";

export function Dashboard() {
  const {
    loading,
    favoriteTools,
    otherTools,
    userPlan,
    isTrialActive
  } = useTools();

  const {
    showTeacherModal,
    handleTeacherInfo,
    subscriptionLoading,
    userProfile
  } = useDashboard();

  const { usageLimit, loading: loadingUsage } = useToolUsage();

  if (loading || subscriptionLoading || loadingUsage) {
    return (
        <div
            className="min-h-screen bg-background dark:bg-dark-background flex items-center justify-center">
          <LoadingSpinner/>
        </div>
    );
  }

  return (
      <>
        <div className="min-h-screen bg-background dark:bg-dark-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <WelcomeBanner 
            userTitle={userProfile?.title}
            userPlan={userPlan}
            isTrialActive={isTrialActive}
          />
          
          {/* Show usage limit banner for free plan users */}
          {userPlan === PLAN.FREE && usageLimit && (
            <UsageLimitBanner usageLimit={usageLimit} />
          )}
          
          <ToolGrid tools={favoriteTools} title="Favorite Tools" />
          <ToolGrid tools={otherTools} title="All Tools" />
        </div>
      </div>

      <TeacherInfoModal
        isOpen={showTeacherModal}
        onSubmit={handleTeacherInfo}
      />
    </>
  );
}