import { useNavigate } from 'react-router-dom';
import { PLAN } from "../../utils/constants.ts";

interface WelcomeBannerProps {
  userTitle?: string;
  userPlan: 'free' | 'plus' | 'enterprise';
  isTrialActive: boolean;
}

export function WelcomeBanner({ userTitle, userPlan, isTrialActive }: WelcomeBannerProps) {
  useNavigate();

  const getPlanBadge = () => {
    if (userPlan === PLAN.ENTERPRISE) {
      return (
        <span className="bg-accent dark:bg-accent text-white px-3 py-1 rounded-full text-sm">
          Enterprise Plan
        </span>
      );
    }

    if (isTrialActive) {
      return (
        <div className="flex items-center space-x-2">
          <span className="bg-accent dark:bg-accent text-white px-3 py-1 rounded-full text-sm">
            Plus
          </span>
          <span className="text-cream dark:text-dark-text">•</span>
          <span className="text-cream dark:text-dark-text">
            Trial Active
          </span>
          <span className="text-cream dark:text-dark-text">•</span>
          {userPlan === PLAN.PLUS && isTrialActive && (
            <a href="/profile/subscription" className="ml-4 text-cream dark:text-dark-text underline hover:text-white">
              Subscribe Now
            </a>
          )}
        </div>
      );
    }

    if (userPlan === PLAN.PLUS) {
      return (
        <span className="bg-accent dark:bg-accent text-white px-3 py-1 rounded-full text-sm">
          Plus Plan
        </span>
      );
    }

    return (
      <span className="bg-accent dark:bg-accent text-white px-3 py-1 rounded-full text-sm">
        Free Plan
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-br from-primary-dark via-primary to-primary dark:from-dark-nav dark:via-dark-nav dark:to-dark-nav rounded-2xl shadow-soft dark:shadow-dark-soft p-8 mb-12">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-cream dark:text-dark-text mb-3">
            Welcome{userTitle ? `, ${userTitle}` : ''}!
          </h1>
          <p className="text-lg text-cream/90 dark:text-dark-text/90">Access your AI-powered teaching tools below.</p>

          <div className="mt-4">
            {getPlanBadge()}

            {userPlan === PLAN.FREE && !isTrialActive && (
              <a href="/profile/subscription" className="ml-4 text-cream dark:text-dark-text underline hover:text-white/80">
                Upgrade to access premium tools
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}