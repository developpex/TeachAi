import { Request, Response } from 'express';
import { UserService } from '../services/userService';

interface AuthenticatedRequest extends Request {
    user?: { uid: string };
}

export class UserController {
    static async deleteUser(req: AuthenticatedRequest, res: Response) {
        try {
            const { uid } = req.params;

            if (!req.user?.uid) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const result = await UserService.deleteUser(req.user.uid, uid);
            return res.json(result);
        } catch (error: any) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: error.message || 'Failed to delete user' });
        }
    }
}
