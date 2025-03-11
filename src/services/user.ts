import { 
  getFirestore, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { 
  getAuth,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  UserCredential,
  sendPasswordResetEmail
} from 'firebase/auth';
import { initializeApp, deleteApp } from 'firebase/app';
import { generatePassword } from '../utils/auth';
import type { AddUserData } from '../types/admin';
import { PLAN } from "../utils/constants";

export class UserService {
  private static instance: UserService;
  private db = getFirestore();
  private auth = getAuth();
  private readonly apiUrl: string;

  private constructor() {
      this.apiUrl = 'http://localhost:3000/user';
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async sendPasswordReset(email: string): Promise<void> {
    try {
      console.log('Sending password reset email to:', email);
      await sendPasswordResetEmail(this.auth, email);
      console.log('Password reset email sent successfully');
    } catch (error) {
      console.error('Error sending password reset:', error);
      throw error;
    }
  }

  private async createAuthUser(email: string, password: string): Promise<UserCredential> {
    const currentApp = this.auth.app;
    const config = {
      apiKey: currentApp.options.apiKey,
      authDomain: currentApp.options.authDomain,
      projectId: currentApp.options.projectId,
      storageBucket: currentApp.options.storageBucket,
      messagingSenderId: currentApp.options.messagingSenderId,
      appId: currentApp.options.appId,
      measurementId: currentApp.options.measurementId
    };

    const tempApp = initializeApp(config, 'tempApp');
    const tempAuth = getAuth(tempApp);

    try {
      console.log('Creating new user with temporary auth instance');
      const userCredential = await createUserWithEmailAndPassword(
        tempAuth,
        email,
        password
      );
      console.log('User created successfully:', userCredential.user.uid);
      return userCredential;
    } finally {
      try {
        console.log('Cleaning up temporary Firebase app');
        await deleteApp(tempApp);
        console.log('Temporary app deleted successfully');
      } catch (error) {
        console.error('Error deleting temporary app:', error);
      }
    }
  }

  private async getExistingUserUid(email: string): Promise<string | null> {
    try {
      const methods = await fetchSignInMethodsForEmail(this.auth, email);
      if (methods.length === 0) {
        return null;
      }

      if (methods.includes(EmailAuthProvider.PROVIDER_ID)) {
        try {
          await signInWithEmailAndPassword(this.auth, email, 'dummy-password');
        } catch (error: any) {
          if (error.customData?.user?.uid) {
            return error.customData.user.uid;
          }
        }
      }

      console.log('User exists but could not get UID. Available methods:', methods);
      return null;
    } catch (error) {
      console.error('Error checking existing user:', error);
      return null;
    }
  }

  public async addUser(data: AddUserData): Promise<void> {
    const { email, role, schoolId, subjects } = data;

    try {
      console.log('Starting user creation/update process for:', email);
      
      const existingUid = await this.getExistingUserUid(email);
      
      if (existingUid) {
        console.log('Found existing user with UID:', existingUid);
        
        const userRef = doc(this.db, 'users', existingUid);
        const userData = {
          email,
          role,
          schoolId,
          subjects,
          plan: PLAN.ENTERPRISE,
          updatedAt: Timestamp.now()
        };

        await setDoc(userRef, userData, { merge: true });
        console.log('Updated existing user document');
        
        await this.sendPasswordReset(email);
        return;
      }

      console.log('Creating new user...');
      const password = generatePassword();
      const userCredential = await this.createAuthUser(email, password);
      
      const userRef = doc(this.db, 'users', userCredential.user.uid);
      const userData = {
        email,
        role,
        schoolId,
        subjects,
        plan: PLAN.ENTERPRISE,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await setDoc(userRef, userData);
      console.log('Created new user document with UID:', userCredential.user.uid);

      await this.sendPasswordReset(email);

    } catch (error: any) {
      console.error('Error in addUser:', error);
      if (error.code === 'auth/email-already-in-use') {
        console.error('Email already in use. Please try again to get existing UID.');
      }
      throw error;
    }
  }

  public async removeUser(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      console.log('Starting user removal process for:', userId);

      const currentUser = this.auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      const idToken = await currentUser.getIdToken();
      const response = await fetch(`${this.apiUrl}/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete user');
      }

      console.log('Deleting Firestore document...');
      const userRef = doc(this.db, 'users', userId);
      await deleteDoc(userRef);
      console.log('User document deleted successfully');

    } catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  }

  public async updateUserRole(userId: string, newRole: 'admin' | 'user'): Promise<void> {
    try {
      console.log('Updating role for user:', userId, 'to:', newRole);
      const userRef = doc(this.db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: Timestamp.now()
      });
      console.log('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  public async updateUserSubjects(userId: string, subjects: string[]): Promise<void> {
    try {
      console.log('Updating subjects for user:', userId);
      const userRef = doc(this.db, 'users', userId);
      await updateDoc(userRef, {
        subjects,
        updatedAt: Timestamp.now()
      });
      console.log('User subjects updated successfully');
    } catch (error) {
      console.error('Error updating user subjects:', error);
      throw error;
    }
  }
}