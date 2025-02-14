import { useStripeCheckout } from '../../hooks/useStripeCheckout';
import { PRICE_IDS } from '../../config/stripe';

interface SubscribeButtonProps {
  className?: string;
}

export function SubscribeButton({ className = '' }: SubscribeButtonProps) {
  const { createCheckoutSession, loading, error } = useStripeCheckout();

  const handleSubscribe = async () => {
    try {
      await createCheckoutSession(PRICE_IDS.monthly);
    } catch (err) {
      console.error('Subscription error:', err);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-coral/20 text-accent-dark rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <button 
        onClick={handleSubscribe}
        disabled={loading}
        className={`w-full px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? 'Processing...' : 'Subscribe Now'}
      </button>
    </div>
  );
}