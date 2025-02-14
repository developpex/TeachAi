import { X, AlertTriangle } from 'lucide-react';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  currentPeriodEnd?: string;
}

export function CancelSubscriptionModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  currentPeriodEnd
}: CancelSubscriptionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-sage/10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-coral/10 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold text-primary-dark">Cancel Subscription</h3>
            </div>
            <button onClick={onClose} className="text-primary hover:text-primary-dark">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-8">
            <p className="text-primary mb-4">
              Are you sure you want to cancel your subscription? Here's what will happen:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start text-primary">
                <span className="h-5 w-5 text-accent mr-2">•</span>
                Your subscription will remain active until{' '}
                {currentPeriodEnd ? (
                  <span className="font-medium">
                    {new Date(currentPeriodEnd).toLocaleDateString()}
                  </span>
                ) : 'the end of your billing period'}
              </li>
              <li className="flex items-start text-primary">
                <span className="h-5 w-5 text-accent mr-2">•</span>
                You'll continue to have access to all Plus features until then
              </li>
              <li className="flex items-start text-primary">
                <span className="h-5 w-5 text-accent mr-2">•</span>
                No further charges will be made to your account
              </li>
              <li className="flex items-start text-primary">
                <span className="h-5 w-5 text-accent mr-2">•</span>
                You can reactivate your subscription at any time before it expires
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Cancelling...' : 'Yes, Cancel My Subscription'}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full px-6 py-3 border-2 border-sage/30 text-primary rounded-lg hover:bg-sage/5 transition-all duration-300"
            >
              Keep My Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}