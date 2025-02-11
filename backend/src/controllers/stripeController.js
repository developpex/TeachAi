import stripe, { PRICE_IDS } from '../config/stripe.js';

export async function createCheckoutSession(req, res) {
  try {
    const { priceId, successUrl, cancelUrl, email } = req.body;

    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({ 
        error: 'Missing required fields: priceId, successUrl, or cancelUrl' 
      });
    }

    const validPriceIds = Object.values(PRICE_IDS);
    if (!validPriceIds.includes(priceId)) {
      return res.status(400).json({ error: 'Invalid price ID' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1
      }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_email: email
    });

    res.json({ 
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create checkout session'
    });
  }
}

export async function getCheckoutSession(req, res) {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      id: session.id,
      subscription: session.subscription,
      customer: session.customer,
      status: session.status
    });
  } catch (error) {
    console.error('Error fetching checkout session:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getSubscriptionStatus(req, res) {
  try {
    const { subscriptionId } = req.params;
    
    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID is required' });
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    res.json({
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function cancelSubscription(req, res) {
  try {
    const { subscriptionId } = req.body;
    
    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID is required' });
    }

    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });

    res.json({
      message: 'Subscription will be canceled at the end of the billing period',
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: error.message });
  }
}