import {Router, raw} from 'express';
import { handleWebhook } from '../controllers/webhookController';

const router = Router();

router.post('/', raw({ type: 'application/json' }), handleWebhook);

export default router;