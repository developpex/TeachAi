import { Router } from 'express';
import {queryHandler} from "../controllers/toolsController";

const router = Router();

router.post('/test', queryHandler);

export default router;
