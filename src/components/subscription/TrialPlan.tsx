import { Star, Package } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { SubscribeButton } from './SubscribeButton';

interface TrialPlanProps {
  trialStartDate: Date;
  trialEndDate: Date;
}

export function TrialPlan({ trialStartDate, trialEndDate }: TrialPlanProps) {
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
        <span className="px-3 py-1 bg-accent/20 dark:bg-accent/10 text-accent rounded-full text-sm">
          Trial
        </span>
      </div>

      <div className="bg-sage/5 dark:bg-dark-surface rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xl font-semibold text-primary-dark dark:text-dark-text">Plus Plan</h4>
            <p className="text-primary dark:text-dark-text-secondary">Trial ends {formatDistanceToNow(trialEndDate, { addSuffix: true })}</p>
            <p className="text-sm text-primary/80 dark:text-dark-text-secondary/80 mt-1">
              Started {formatDistanceToNow(trialStartDate, { addSuffix: true })}
            </p>
          </div>
          <Star className="h-6 w-6 text-accent fill-current" />
        </div>
        
        <SubscribeButton />
      </div>
    </div>
  );
}