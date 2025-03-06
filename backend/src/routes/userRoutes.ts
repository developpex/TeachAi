import { Router } from 'express';
import { verifyFirebaseToken } from '../config/firebase';
import { UserController } from '../controllers/userController';

const router = Router();

router.delete('/:uid', verifyFirebaseToken, UserController.deleteUser);

export default router;
