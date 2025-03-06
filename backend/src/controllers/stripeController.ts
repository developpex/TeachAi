import { Request, Response } from 'express';
import { StripeService } from '../services/stripeService';

export async function createCheckoutSession(req: Request, res: Response) {
  try {
    const { priceId, successUrl, cancelUrl, email } = req.body;
    const session = await StripeService.createCheckoutSession(priceId, successUrl, cancelUrl, email);

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: (error as Error).message || 'Failed to create checkout session' });
  }
}

export async function getCheckoutSession(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    const session = await StripeService.getCheckoutSession(sessionId);

    res.json({ id: session.id, subscription: session.subscription, customer: session.customer, status: session.status });
  } catch (error) {
    console.error('Error fetching checkout session:', error);
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function getSubscriptionStatus(req: Request, res: Response) {
  try {
    const { subscriptionId } = req.params;
    const subscription = await StripeService.getSubscriptionStatus(subscriptionId);

    res.json({
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function cancelSubscription(req: Request, res: Response) {
  try {
    const { subscriptionId } = req.body;
    const subscription = await StripeService.cancelSubscription(subscriptionId);

    res.json({
      message: 'Subscription will be canceled at the end of the billing period',
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: (error as Error).message });
  }
}
