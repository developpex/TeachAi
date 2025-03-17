import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  Timestamp,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore';
import {createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail} from 'firebase/auth';
import {deleteApp, initializeApp} from 'firebase/app';
import type {CreateSchoolData, School, User} from '../types/admin';
import {generatePassword} from '../utils/auth';
import {PLAN, ROLE} from "../utils/constants.ts";

export class AdminService {
  private static instance: AdminService;
  private db = getFirestore();
  private auth = getAuth();

  private constructor() {}

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  private async createAuthUser(email: string, password: string) {
    // Get the current Firebase config
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

    // Initialize a new Firebase app instance for user creation
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
        // Continue even if cleanup fails
      }
    }
  }

  public async createSchool(data: CreateSchoolData): Promise<string> {
    const { name, domain, adminEmail, maxUsers } = data;

    try {
      console.log('Starting school creation process');
      console.log('School data:', { name, domain, adminEmail, maxUsers });

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new Error('School name is required');
      }

      if (!adminEmail || typeof adminEmail !== 'string' || !adminEmail.includes('@')) {
        throw new Error('Valid admin email is required');
      }

      if (!maxUsers || maxUsers < 1) {
        throw new Error('Valid user limit is required');
      }

      // Generate a secure password for the admin user
      const password = generatePassword();
      console.log('Generated temporary password for admin');

      // Create admin user with temporary auth instance
      let adminUserCredential;
      try {
        adminUserCredential = await this.createAuthUser(adminEmail, password);
      } catch (error) {
        console.error('Error creating admin user:', error);
        const authError = error as AuthError;
        if (authError.code === 'auth/email-already-in-use') {
          throw new Error('Admin email is already registered');
        }
        if (authError.code === 'auth/invalid-email') {
          throw new Error('Invalid email format');
        }
        throw error;
      }

      // Create school and admin user documents
      const batch = writeBatch(this.db);
      const now = Timestamp.now();

      // Create school document
      const schoolRef = doc(collection(this.db, 'schools'));
      const schoolData: Omit<School, 'id'> = {
        name: name.trim(),
        ...(domain?.trim() ? { domain: domain.trim() } : {}),
        maxUsers,
        ownerId: adminUserCredential.user.uid,
        createdAt: now,
        updatedAt: now
      };

      console.log('Creating school document:', schoolRef.id);
      batch.set(schoolRef, schoolData);

      // Create admin user document
      const userRef = doc(this.db, 'users', adminUserCredential.user.uid);
      const userData = {
        email: adminEmail.trim(),
        role: ROLE.ADMIN,
        schoolId: schoolRef.id,
        plan: PLAN.ENTERPRISE,
        createdAt: now,
        updatedAt: now
      };

      console.log('Creating admin user document');
      batch.set(userRef, userData);

      // Commit the batch
      console.log('Committing batch write');
      await batch.commit();
      console.log('Batch write successful');

      // Send password reset email
      console.log('Sending password reset email to admin');
      await sendPasswordResetEmail(this.auth, adminEmail.trim());
      console.log('Password reset email sent successfully');

      return schoolRef.id;
    } catch (error) {
      console.error('Error creating school:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create school');
    }
  }

  public async getUserRole(userId: string): Promise<'owner' | 'admin' | 'user' | null> {
    if (!userId) {
      console.log('No user ID provided');
      return null;
    }

    try {
      const userRef = doc(this.db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.log('No user document found');
        return null;
      }

      const userData = userDoc.data();
      return userData.role || null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }

  public async getUserById(userId: string): Promise<User | null> {
    if (!userId) {
      console.log('No user ID provided');
      return null;
    }

    try {
      const userRef = doc(this.db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.log('No user document found');
        return null;
      }

      const userData = userDoc.data();
      console.log('User data:', userData);
      
      return {
        id: userDoc.id,
        ...userData
      } as User;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  public async getSchoolById(schoolId: string): Promise<School | null> {
    if (!schoolId) {
      console.log('No school ID provided');
      return null;
    }

    try {
      const schoolRef = doc(this.db, 'schools', schoolId);
      const schoolDoc = await getDoc(schoolRef);
      
      if (!schoolDoc.exists()) {
        console.log('No school document found');
        return null;
      }

      const schoolData = schoolDoc.data();

      return {
        id: schoolDoc.id,
        ...schoolData
      } as School;
    } catch (error) {
      console.error('Error getting school:', error);
      return null;
    }
  }

  public async getAllSchools(): Promise<School[]> {
    try {
      const schoolsRef = collection(this.db, 'schools');
      const snapshot = await getDocs(schoolsRef);
      
      if (snapshot.empty) {
        console.log('No schools found');
        return [];
      }

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as School));
    } catch (error) {
      console.error('Error getting schools:', error);
      throw new Error('Failed to fetch schools');
    }
  }

  public async getSchoolUsers(schoolId: string): Promise<User[]> {
    if (!schoolId) {
      console.log('No school ID provided');
      return [];
    }

    try {
      const usersQuery = query(
        collection(this.db, 'users'),
        where('schoolId', '==', schoolId)
      );
      const snapshot = await getDocs(usersQuery);
      
      if (snapshot.empty) {
        console.log('No users found for school');
        return [];
      }

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
    } catch (error) {
      console.error('Error getting school users:', error);
      throw new Error('Failed to fetch school users');
    }
  }

  public async removeUser(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      console.log('Starting user removal process for:', userId);

      // Get user document
      const userRef = doc(this.db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User document not found');
      }

      // Delete the user document from Firestore
      console.log('Deleting user document from Firestore');
      await deleteDoc(userRef);
      console.log('User document deleted successfully');

    } catch (error) {
      console.error('Error removing user:', error);
      throw new Error('Failed to remove user');
    }
  }

  public async updateUserRole(userId: string, newRole: 'admin' | 'user'): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required');
    }

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
      throw new Error('Failed to update user role');
    }
  }

  public async updateSchoolMaxUsers(schoolId: string, maxUsers: number): Promise<void> {
    if (!schoolId) {
      throw new Error('School ID is required');
    }

    if (maxUsers < 1) {
      throw new Error('Max users must be at least 1');
    }

    try {
      console.log('Updating max users for school:', schoolId);
      const schoolRef = doc(this.db, 'schools', schoolId);
      await updateDoc(schoolRef, {
        maxUsers,
        updatedAt: Timestamp.now()
      });
      console.log('School max users updated successfully');
    } catch (error) {
      console.error('Error updating school max users:', error);
      throw new Error('Failed to update school max users');
    }
  }

  public async deleteSchool(schoolId: string): Promise<void> {
    if (!schoolId) {
      throw new Error('School ID is required');
    }

    try {
      console.log('Starting school deletion process for:', schoolId);

      // Get all users for this school
      const usersQuery = query(
        collection(this.db, 'users'),
        where('schoolId', '==', schoolId)
      );
      const userSnapshot = await getDocs(usersQuery);
      
      // Create a batch for Firestore operations
      const batch = writeBatch(this.db);

      // Add all user deletions to batch
      userSnapshot.docs.forEach(userDoc => {
        const userRef = doc(this.db, 'users', userDoc.id);
        batch.delete(userRef);
      });

      // Add school deletion to batch
      const schoolRef = doc(this.db, 'schools', schoolId);
      batch.delete(schoolRef);

      // Commit the batch
      await batch.commit();
      console.log('School and all associated users deleted successfully');

    } catch (error) {
      console.error('Error deleting school:', error);
      throw new Error('Failed to delete school and its users');
    }
  }
}