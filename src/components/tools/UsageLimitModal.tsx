import { AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, addDays } from 'date-fns';
import type { UsageLimit } from '../../services/usage/types';

interface UsageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  usageLimit: UsageLimit;
}

export function UsageLimitModal({ isOpen, onClose, usageLimit }: UsageLimitModalProps) {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  // Calculate reset date (7 days from week start)
  const resetDate = addDays(usageLimit.weekStartDate, 7);
  const resetTimeString = formatDistanceToNow(resetDate, { addSuffix: true });

  const handleUpgrade = () => {
    onClose();
    navigate('/profile/subscription');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-sage/10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-coral/10 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-2xl font-semibold text-primary-dark">Weekly Limit Reached</h3>
          </div>

          <div className="space-y-4">
            <p className="text-primary">
              You've used all your free tool generations for this week. Upgrade to Plus for unlimited access to all tools.
            </p>

            <div className="flex items-center space-x-2 text-primary/80">
              <RefreshCw className="h-4 w-4" />
              <span>Your limit will reset {resetTimeString}</span>
            </div>

            <div className="bg-mint/10 p-4 rounded-lg">
              <h4 className="font-medium text-primary-dark mb-2">Plus Plan Benefits:</h4>
              <ul className="space-y-2 text-primary">
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-accent" />
                  Unlimited tool generations
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-accent" />
                  Access to premium tools
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-accent" />
                  Priority support
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleUpgrade}
              className="block w-full px-6 py-3 bg-accent text-white text-center rounded-lg hover:bg-accent-dark transition-all duration-300"
            >
              Upgrade to Plus
            </button>
            <button
              onClick={onClose}
              className="block w-full px-6 py-3 border-2 border-sage/30 text-primary rounded-lg hover:bg-sage/5 transition-all duration-300"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}