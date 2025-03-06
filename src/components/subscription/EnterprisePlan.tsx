import { Star, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE } from "../../utils/constants.ts";

export function EnterprisePlan() {
  const { userProfile } = useAuth();

  return (
    <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-mint/20 dark:bg-mint/10 rounded-lg">
            <Package className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-dark dark:text-dark-text">Current Plan</h3>
            <p className="text-sm text-primary dark:text-dark-text-secondary">Your enterprise subscription</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-mint/20 dark:bg-mint/10 text-primary dark:text-dark-text rounded-full text-sm">
          Enterprise
        </span>
      </div>

      <div className="bg-sage/5 dark:bg-dark-surface rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xl font-semibold text-primary-dark dark:text-dark-text">Enterprise Plan</h4>
            <p className="text-primary dark:text-dark-text-secondary">School-wide license</p>
            {userProfile?.role === ROLE.OWNER && (
              <p className="text-sm text-accent mt-1">Owner Account</p>
            )}
          </div>
          <Star className="h-6 w-6 text-accent fill-current" />
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center text-primary dark:text-dark-text-secondary">
            <Star className="h-4 w-4 text-accent mr-2" />
            School-wide deployment
          </div>
          <div className="flex items-center text-primary dark:text-dark-text-secondary">
            <Star className="h-4 w-4 text-accent mr-2" />
            Admin dashboard
          </div>
          <div className="flex items-center text-primary dark:text-dark-text-secondary">
            <Star className="h-4 w-4 text-accent mr-2" />
            Custom integrations
          </div>
          <div className="flex items-center text-primary dark:text-dark-text-secondary">
            <Star className="h-4 w-4 text-accent mr-2" />
            24/7 dedicated support
          </div>
        </div>

        <div className="mt-6 p-4 bg-mint/10 dark:bg-mint/5 rounded-lg">
          <p className="text-primary dark:text-dark-text-secondary text-sm">
            For billing inquiries or plan changes, please contact your account manager or our enterprise support team.
          </p>
        </div>
      </div>
    </div>
  );
}