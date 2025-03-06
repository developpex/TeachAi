import { Router } from 'express';
import {queryHandler} from "../controllers/toolsController";

const router = Router();

// Query route: handles AI retrieval requests.
router.post('/query', queryHandler);

export default router;
