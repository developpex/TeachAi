import * as admin from 'firebase-admin';
import { ROLE } from '../../../src/utils/constants';

export class UserService {
    static async deleteUser(adminUID: string, targetUID: string) {
        const db = admin.firestore();

        // Fetch the admin user's document
        const adminDoc = await db.collection('users').doc(adminUID).get();
        if (!adminDoc.exists) {
            throw new Error('Not authorized');
        }

        const adminData = adminDoc.data();
        if (!adminData || ![ROLE.OWNER, ROLE.ADMIN].includes(adminData.role)) {
            throw new Error('Not authorized');
        }

        // Delete the auth user
        try {
            await admin.auth().deleteUser(targetUID);
        } catch (error: any) {
            if (error.code !== 'auth/user-not-found') {
                throw new Error(error.message || 'Failed to delete user');
            }
        }

        // Delete the user's Firestore document
        await db.collection('users').doc(targetUID).delete();

        return { message: 'User deleted successfully' };
    }
}
