import {Router} from 'express';
import {
  createCheckoutSession,
  getCheckoutSession,
  getSubscriptionStatus,
  cancelSubscription
} from '../controllers/stripeController';

const router = Router();

router.post('/create-checkout-session', createCheckoutSession);
router.get('/checkout-session/:sessionId', getCheckoutSession);
router.get('/subscription-status/:subscriptionId', getSubscriptionStatus);
router.post('/cancel-subscription', cancelSubscription);

export default router;