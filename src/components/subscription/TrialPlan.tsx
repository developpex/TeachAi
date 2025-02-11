import React from 'react';
import { Star, Package } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { SubscribeButton } from './SubscribeButton';

interface TrialPlanProps {
  trialStartDate: Date;
  trialEndDate: Date;
}

export function TrialPlan({ trialStartDate, trialEndDate }: TrialPlanProps) {
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
        <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
          Trial
        </span>
      </div>

      <div className="bg-sage/5 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xl font-semibold text-primary-dark">Plus Plan</h4>
            <p className="text-primary">Trial ends {formatDistanceToNow(trialEndDate, { addSuffix: true })}</p>
            <p className="text-sm text-primary/80 mt-1">
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