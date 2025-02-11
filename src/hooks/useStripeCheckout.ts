import { useState } from 'react';
import StripeService from '../services/stripe';

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stripeService = StripeService.getInstance();

  const createCheckoutSession = async (priceId: string) => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      const { url } = await stripeService.createCheckoutSession({
        priceId,
        successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`
      });

      if (!url) {
        throw new Error('Failed to create checkout session');
      }

      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError(err instanceof Error ? err.message : 'Failed to start checkout process');
      setLoading(false);
    }
  };

  return {
    createCheckoutSession,
    loading,
    error
  };
}