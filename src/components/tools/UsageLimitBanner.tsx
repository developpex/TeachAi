import { AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { UsageLimit } from '../../services/usage/types';
import { formatDistanceToNow, addDays } from 'date-fns';

interface UsageLimitBannerProps {
  usageLimit: UsageLimit;
}

export function UsageLimitBanner({ usageLimit }: UsageLimitBannerProps) {
  const { weeklyLimit, currentUsage, remainingUses, weekStartDate } = usageLimit;
  const isLow = remainingUses <= 2;
  const isExhausted = remainingUses === 0;
  const navigate = useNavigate();

  // Calculate reset date (7 days from week start)
  const resetDate = addDays(weekStartDate, 7);
  const resetTimeString = formatDistanceToNow(resetDate, { addSuffix: true });

  return (
    <div className={`rounded-lg p-4 mb-8 ${
      isExhausted 
        ? 'bg-coral/20 border-2 border-accent' 
        : isLow 
          ? 'bg-accent/10 border border-accent/20'
          : 'bg-mint/10 border border-mint/20'
    }`}>
      <div className="flex items-start space-x-3">
        {(isLow || isExhausted) && (
          <div className="flex-shrink-0 mt-1">
            <AlertTriangle className="h-5 w-5 text-accent" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium ${isExhausted ? 'text-accent-dark' : 'text-primary-dark'}`}>
              {isExhausted 
                ? 'Weekly Limit Reached'
                : isLow
                  ? 'Almost at Weekly Limit'
                  : 'Weekly Tool Usage'}
            </h3>
            <button
              onClick={() => navigate('/profile/subscription')}
              className="text-sm text-accent hover:text-accent-dark flex items-center"
            >
              Upgrade Plan
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <p className={`text-sm mt-1 ${isExhausted ? 'text-accent-dark' : 'text-primary'}`}>
            {isExhausted
              ? 'You\'ve used all your free tool generations for this week. Upgrade to Plus for unlimited access.'
              : `You have used ${currentUsage} of ${weeklyLimit} tool generations this week${
                  isLow ? '. Consider upgrading to Plus for unlimited access.' : '.'
                }`}
          </p>

          {/* Reset Time */}
          <p className={`text-sm mt-1 flex items-center ${isExhausted ? 'text-accent-dark/80' : 'text-primary/80'}`}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Resets {resetTimeString}
          </p>

          {!isExhausted && (
            <div className="mt-2 w-full bg-white/50 rounded-full h-2">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  isLow ? 'bg-accent' : 'bg-mint'
                }`}
                style={{ width: `${(currentUsage / weeklyLimit) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}