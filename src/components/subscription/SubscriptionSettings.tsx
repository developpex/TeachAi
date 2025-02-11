import React from 'react';
import { Star, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SubscriptionStatus } from '../SubscriptionStatus';

export function SubscriptionSettings() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  console.log('Current user profile:', userProfile); // Debug log

  // Early return if no user profile
  if (!userProfile) {
    return (
      <div className="bg-white rounded-lg shadow-soft p-8 border border-sage/10">
        <div className="bg-sage/5 rounded-lg p-6 text-center">
          <p className="text-primary mb-4">Unable to load subscription information</p>
          <button
            onClick={() => navigate('/pricing')}
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300"
          >
            View Plans
          </button>
        </div>
      </div>
    );
  }

  // Check for enterprise plan or owner role
  const isEnterprise = userProfile.plan === 'enterprise';
  const isOwner = userProfile.role === 'owner';

  if (isEnterprise || isOwner) {
    return (
      <div className="bg-white rounded-lg shadow-soft p-8 border border-sage/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-mint/20 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-dark">Current Plan</h3>
              <p className="text-sm text-primary">Your enterprise subscription</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-mint/20 text-primary rounded-full text-sm">
            Enterprise
          </span>
        </div>

        <div className="bg-sage/5 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-semibold text-primary-dark">Enterprise Plan</h4>
              <p className="text-primary">School-wide license</p>
              {userProfile.role === 'owner' && (
                <p className="text-sm text-accent mt-1">Owner Account</p>
              )}
            </div>
            <Star className="h-6 w-6 text-accent fill-current" />
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center text-primary">
              <Star className="h-4 w-4 text-accent mr-2" />
              School-wide deployment
            </div>
            <div className="flex items-center text-primary">
              <Star className="h-4 w-4 text-accent mr-2" />
              Admin dashboard
            </div>
            <div className="flex items-center text-primary">
              <Star className="h-4 w-4 text-accent mr-2" />
              Custom integrations
            </div>
            <div className="flex items-center text-primary">
              <Star className="h-4 w-4 text-accent mr-2" />
              24/7 dedicated support
            </div>
          </div>

          <div className="mt-6 p-4 bg-mint/10 rounded-lg">
            <p className="text-primary text-sm">
              For billing inquiries or plan changes, please contact your account manager or our enterprise support team.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // For all other plans
  return <SubscriptionStatus />;
}