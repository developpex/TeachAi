import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface WelcomeBannerProps {
  userTitle?: string;
  userPlan: 'free' | 'plus' | 'enterprise';
  isTrialActive: boolean;
}

export function WelcomeBanner({ userTitle, userPlan, isTrialActive }: WelcomeBannerProps) {
  const navigate = useNavigate();

  const getPlanBadge = () => {
    if (userPlan === 'enterprise') {
      return (
        <span className="bg-accent text-white px-3 py-1 rounded-full text-sm">
          Enterprise Plan
        </span>
      );
    }
    
    if (isTrialActive) {
      return (
        <div className="flex items-center space-x-2">
          <span className="bg-accent text-white px-3 py-1 rounded-full text-sm">
            Plus
          </span>
          <span className="text-cream">•</span>
          <span className="text-cream">
            Trial Active
          </span>
          <span className="text-cream">•</span>
          {userPlan === 'plus' && isTrialActive && (
              <a href="/profile/subscription" className="ml-4 text-cream underline hover:text-white">
                Subscribe Now
              </a>
            )}
        </div>
      );
    }
    
    if (userPlan === 'plus') {
      return (
        <span className="bg-accent text-white px-3 py-1 rounded-full text-sm">
          Plus Plan
        </span>
      );
    }
    
    return (
      <span className="bg-accent text-white px-3 py-1 rounded-full text-sm">
        Free Plan
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-br from-primary-dark via-primary to-sage rounded-2xl shadow-soft p-8 mb-12">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-cream mb-3">
            Welcome{userTitle ? `, ${userTitle}` : ''}!
          </h1>
          <p className="text-lg text-cream/90">Access your AI-powered teaching tools below.</p>
          
          <div className="mt-4">
            {getPlanBadge()}
            
            {userPlan === 'free' && !isTrialActive && (
              <a href="/profile/subscription" className="ml-4 text-cream underline hover:text-white">
                Upgrade to access premium tools
              </a>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}