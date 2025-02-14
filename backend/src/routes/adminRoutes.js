import express from 'express';
import admin from 'firebase-admin';
import { verifyFirebaseToken } from '../config/firebase.js';
import {ROLE} from "../../../src/utils/constants.js";

const router = express.Router();

// Delete Firebase auth user
router.delete('/users/:uid', verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.params;
    
    // Get the admin user's document
    const db = admin.firestore();
    const adminDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!adminDoc.exists) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const adminData = adminDoc.data();
    if (![ROLE.OWNER, ROLE.ADMIN].includes(adminData.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Delete the auth user
    await admin.auth().deleteUser(uid);
    
    // Delete the user's Firestore document
    await db.collection('users').doc(uid).delete();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    
    if (error.code === 'auth/user-not-found') {
      // If the auth user doesn't exist, still try to delete the Firestore document
      try {
        await admin.firestore().collection('users').doc(req.params.uid).delete();
        return res.json({ message: 'User document deleted successfully' });
      } catch (docError) {
        console.error('Error deleting user document:', docError);
      }
    }
    
    res.status(500).json({ error: error.message || 'Failed to delete user' });
  }
});

export default router;