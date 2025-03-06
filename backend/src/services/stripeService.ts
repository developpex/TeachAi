import Stripe from 'stripe';
import stripe, { PRICE_IDS } from '../config/stripe';
import { db } from '../config/firebase';
import { PLAN } from '../../../src/utils/constants';

async function getCustomerMetadata(customerId: string): Promise<{ firebaseUID: string } | null> {
    try {
        const customer = await stripe.customers.retrieve(customerId);

        if ('deleted' in customer && customer.deleted) {
            console.error(`Customer ${customerId} has been deleted.`);
            return null;
        }

        return { firebaseUID: (customer as Stripe.Customer).metadata.firebaseUID };
    } catch (error) {
        console.error(`Error retrieving customer ${customerId}:`, error);
        return null;
    }
}

export class StripeService {
    static async createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string, email: string) {
        if (!priceId || !successUrl || !cancelUrl) {
            throw new Error('Missing required fields: priceId, successUrl, or cancelUrl');
        }

        const validPriceIds = Object.values(PRICE_IDS);
        if (!validPriceIds.includes(priceId)) {
            throw new Error('Invalid price ID');
        }

        return stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            allow_promotion_codes: true,
            billing_address_collection: 'required',
            customer_email: email
        });
    }

    static async getCheckoutSession(sessionId: string) {
        if (!sessionId) {
            throw new Error('Session ID is required');
        }
        return stripe.checkout.sessions.retrieve(sessionId);
    }

    static async getSubscriptionStatus(subscriptionId: string) {
        if (!subscriptionId) {
            throw new Error('Subscription ID is required');
        }
        return stripe.subscriptions.retrieve(subscriptionId);
    }

    static async cancelSubscription(subscriptionId: string) {
        if (!subscriptionId) {
            throw new Error('Subscription ID is required');
        }
        return stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
    }

    static async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
        if (!session.metadata || !session.subscription) {
            console.error('Session metadata or subscription ID is missing.');
            return;
        }

        const { firebaseUID } = session.metadata;

        if (!firebaseUID) {
            console.error('firebaseUID is missing in session metadata.');
            return;
        }

        if (typeof session.subscription !== 'string') {
            console.error('Invalid subscription ID:', session.subscription);
            return;
        }

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
            hadPreviousTrial: true
        });
    }

    static async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
        if (!invoice.subscription || !invoice.customer) return;

        const customerData = await getCustomerMetadata(invoice.customer as string);
        if (!customerData) return;

        if (typeof invoice.subscription !== 'string') {
            console.error('Invalid subscription ID:', invoice.subscription);
            return;
        }

        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);

        await db.collection('users').doc(customerData.firebaseUID).update({
            subscriptionStatus: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            lastPaymentDate: new Date()
        });
    }

    static async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
        if (!subscription.customer) return;

        const customerData = await getCustomerMetadata(subscription.customer as string);
        if (!customerData) return;

        await db.collection('users').doc(customerData.firebaseUID).update({
            plan: PLAN.FREE,
            subscriptionStatus: 'canceled',
            stripeSubscriptionId: null,
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
            hadPreviousTrial: true
        });
    }

    static async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
        if (!subscription.customer) return;

        const customerData = await getCustomerMetadata(subscription.customer as string);
        if (!customerData) return;

        await db.collection('users').doc(customerData.firebaseUID).update({
            subscriptionStatus: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end
        });
    }
}
