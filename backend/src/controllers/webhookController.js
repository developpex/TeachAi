import stripe from '../config/stripe.js';
import { db } from '../config/firebase.js';
import {PLAN} from "../../../src/utils/constants.js";

export async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await handleSubscriptionUpdated(subscription);
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: error.message });
  }
}

async function handleCheckoutSessionCompleted(session) {
  const { firebaseUID } = session.metadata;
  const subscription = await stripe.subscriptions.retrieve(session.subscription);

  await db.collection('users').doc(firebaseUID).update({
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    plan: PLAN.PLUS,
    isTrialActive: false,
    trialStartDate: null,
    trialEndDate: null,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    hadPreviousTrial: true // Mark that user has had a trial
  });
}

async function handleInvoicePaymentSucceeded(invoice) {
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const customer = await stripe.customers.retrieve(invoice.customer);
    const { firebaseUID } = customer.metadata;

    await db.collection('users').doc(firebaseUID).update({
      subscriptionStatus: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      lastPaymentDate: new Date()
    });
  }
}

async function handleSubscriptionDeleted(subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer);
  const { firebaseUID } = customer.metadata;

  await db.collection('users').doc(firebaseUID).update({
    plan: PLAN.FREE,
    subscriptionStatus: 'canceled',
    stripeSubscriptionId: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    hadPreviousTrial: true // Mark that user has had a trial
  });
}

async function handleSubscriptionUpdated(subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer);
  const { firebaseUID } = customer.metadata;

  await db.collection('users').doc(firebaseUID).update({
    subscriptionStatus: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end
  });
}