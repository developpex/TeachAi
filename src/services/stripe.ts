interface CreateCheckoutSessionParams {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

class StripeService {
  private static instance: StripeService;
  private readonly apiUrl: string;

  private constructor() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    this.apiUrl = isDevelopment 
      ? 'http://localhost:3000/stripe'
      : `${window.location.origin}/stripe`;
  }

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
      throw new Error(errorData.error || 'Request failed');
    }
    return response.json();
  }

  async createCheckoutSession({
    priceId,
    successUrl,
    cancelUrl
  }: CreateCheckoutSessionParams): Promise<{ sessionId: string; url: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId,
          successUrl,
          cancelUrl,
          email: 'test@example.com' // Hardcoded for testing
        })
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error instanceof Error ? error : new Error('Failed to create checkout session');
    }
  }

  async getCheckoutSession(sessionId: string) {
    try {
      const response = await fetch(`${this.apiUrl}/checkout-session/${sessionId}`);
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching checkout session:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch checkout session');
    }
  }

  async getSubscriptionStatus(subscriptionId: string) {
    if (!subscriptionId) {
      throw new Error('Subscription ID is required');
    }

    try {
      const response = await fetch(`${this.apiUrl}/subscription-status/${subscriptionId}`);
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch subscription status');
    }
  }

  async cancelSubscription(subscriptionId: string) {
    if (!subscriptionId) {
      throw new Error('Subscription ID is required');
    }

    try {
      const response = await fetch(`${this.apiUrl}/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subscriptionId })
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error instanceof Error ? error : new Error('Failed to cancel subscription');
    }
  }
}

export default StripeService;