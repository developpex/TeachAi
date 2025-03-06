import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};

// Initialize Firebase Admin only if it hasn't been initialized yet
if (!admin.apps.length) {
  try {
    console.log('Initializing Firebase Admin...');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

export const db = admin.firestore();
export const auth = admin.auth();

export async function verifyFirebaseToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log('Verifying Firebase token...');

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('No Bearer token found');
    res.status(401).json({ error: 'Unauthorized - No token provided' });
    return;
  }

  try {
    const idToken = authHeader.split('Bearer ')[1];
    console.log('Token received:', idToken.substring(0, 10) + '...');

    if (!idToken || idToken === 'null' || idToken === 'undefined') {
      console.log('Invalid token value');
      res.status(401).json({ error: 'Invalid token provided' });
      return;
    }

    console.log('Verifying token...');
    const decodedToken = await auth.verifyIdToken(idToken);
    console.log('Token verified. User:', decodedToken.uid);

    (req as any).user = decodedToken; // Add user property to request
    next();
  } catch (error: any) {
    console.error('Error verifying token:', error);

    if (error.code === 'auth/id-token-expired') {
      res.status(401).json({ error: 'Token expired' });
    } else if (error.code === 'auth/id-token-revoked') {
      res.status(401).json({ error: 'Token revoked' });
    } else if (error.code === 'auth/invalid-id-token') {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
}