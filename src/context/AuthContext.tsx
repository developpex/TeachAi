import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore';
import { auth } from '../config/firebase';

interface UserProfile {
  fullName: string;
  title: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  school?: string;
  language?: string;
  photoURL?: string;
  favorites?: string[];
  plan: 'free' | 'plus' | 'enterprise';
  isTrialActive: boolean;
  trialStartDate?: Date;
  trialEndDate?: Date;
  startDate: Date;
  isProfileComplete: boolean;
  role?: 'owner' | 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userProfile: UserProfile | null;
  signInWithGoogle: () => Promise<{ user: User }>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<User>;
  saveUserProfile: (userId: string, profile: Partial<UserProfile>) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateUserEmail: (currentPassword: string, newEmail: string) => Promise<{ success: boolean; message: string }>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  toggleFavorite: (toolId: string) => Promise<void>;
  startTrial: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const db = getFirestore();

const DEFAULT_PROFILE: UserProfile = {
  fullName: '',
  title: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  gender: '',
  school: '',
  language: 'en',
  favorites: [],
  plan: 'free',
  isTrialActive: false,
  startDate: new Date(),
  isProfileComplete: false
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const db = getFirestore();

  const checkTrialStatus = async (profile: UserProfile) => {
    if (!profile.isTrialActive || !profile.trialEndDate) {
      return profile;
    }

    const now = new Date();
    const trialEnd = profile.trialEndDate instanceof Date 
      ? profile.trialEndDate 
      : profile.trialEndDate.toDate();

    if (now > trialEnd) {
      console.log('Trial has expired, updating profile...');
      const updates = {
        plan: 'free',
        isTrialActive: false,
        hadPreviousTrial: true,
        trialEndDate: null,
        trialStartDate: null
      };

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, updates);
      }

      return {
        ...profile,
        ...updates
      };
    }

    return profile;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const profileDoc = await getDoc(userRef);
          
          if (profileDoc.exists()) {
            const data = profileDoc.data();
            let profile = {
              ...data,
              email: user.email || data.email || '',
              startDate: data.startDate?.toDate() || new Date(),
              trialStartDate: data.trialStartDate?.toDate() || null,
              trialEndDate: data.trialEndDate?.toDate() || null,
              plan: data.plan || 'free'
            } as UserProfile;

            profile = await checkTrialStatus(profile);
            
            if (!data.email && user.email) {
              await updateDoc(userRef, { email: user.email });
            }
            
            setUserProfile(profile);
          } else {
            const initialProfile: UserProfile = {
              ...DEFAULT_PROFILE,
              email: user.email || '',
              startDate: new Date()
            };
            
            await setDoc(userRef, {
              ...initialProfile,
              startDate: Timestamp.fromDate(initialProfile.startDate)
            });
            setUserProfile(initialProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    return userCredential.user;
  };

  const resendVerificationEmail = async () => {
    if (!user) throw new Error('No user logged in');
    await sendEmailVerification(user);
  };

  const saveUserProfile = async (userId: string, profile: Partial<UserProfile>) => {
    try {
      const userRef = doc(db, 'users', userId);
      const currentDoc = await getDoc(userRef);
      const currentProfile = currentDoc.exists() ? currentDoc.data() as UserProfile : DEFAULT_PROFILE;

      const updatedProfile = {
        ...currentProfile,
        ...profile,
        email: profile.email || user?.email || ''
      };

      const profileToSave = {
        ...updatedProfile,
        startDate: Timestamp.fromDate(updatedProfile.startDate),
        trialStartDate: updatedProfile.trialStartDate ? Timestamp.fromDate(updatedProfile.trialStartDate) : null,
        trialEndDate: updatedProfile.trialEndDate ? Timestamp.fromDate(updatedProfile.trialEndDate) : null
      };

      await setDoc(userRef, profileToSave);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const userRef = doc(db, 'users', user.uid);
      
      const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          if (key === 'startDate' && value instanceof Date) {
            acc[key] = Timestamp.fromDate(value);
          } else if (key === 'trialStartDate' && value instanceof Date) {
            acc[key] = Timestamp.fromDate(value);
          } else if (key === 'trialEndDate' && value instanceof Date) {
            acc[key] = Timestamp.fromDate(value);
          } else {
            acc[key] = value;
          }
        }
        return acc;
      }, {} as Record<string, any>);

      if (Object.keys(cleanUpdates).length > 0) {
        await updateDoc(userRef, cleanUpdates);
        setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const updateUserEmail = async (currentPassword: string, newEmail: string) => {
    if (!user) throw new Error('No user logged in');

    try {
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, newEmail);
      
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { email: newEmail });
      
      return {
        success: true,
        message: 'Email updated successfully!'
      };
    } catch (error: any) {
      console.error('Error updating email:', error);
      throw error;
    }
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('No user logged in');
    if (!user.email) throw new Error('User email is required');

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      return {
        success: true,
        message: 'Password updated successfully!'
      };
    } catch (error: any) {
      console.error('Error updating password:', error);
      
      switch (error.code) {
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          throw new Error('Current password is incorrect');
        case 'auth/weak-password':
          throw new Error('New password must be at least 6 characters long');
        case 'auth/requires-recent-login':
          throw new Error('Please sign in again before changing your password');
        case 'auth/too-many-requests':
          throw new Error('Too many attempts. Please try again later');
        default:
          throw new Error('Failed to update password. Please try again');
      }
    }
  };

  const toggleFavorite = async (toolId: string) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const currentFavorites = userProfile?.favorites || [];
      const isFavorite = currentFavorites.includes(toolId);

      if (isFavorite) {
        await updateDoc(userRef, {
          favorites: arrayRemove(toolId)
        });
        setUserProfile(prev => prev ? {
          ...prev,
          favorites: prev.favorites?.filter(id => id !== toolId) || []
        } : null);
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(toolId)
        });
        setUserProfile(prev => prev ? {
          ...prev,
          favorites: [...(prev.favorites || []), toolId]
        } : null);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  const startTrial = async () => {
    if (!user) throw new Error('No user logged in');
    
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    if (userData?.hadPreviousTrial) {
      throw new Error('You have already used your free trial');
    }

    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialStartDate.getDate() + 30);

    try {
      await updateUserProfile({
        plan: 'plus',
        isTrialActive: true,
        trialStartDate,
        trialEndDate,
        hadPreviousTrial: false
      });
    } catch (error) {
      console.error('Error starting trial:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      userProfile,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      saveUserProfile,
      updateUserProfile,
      updateUserEmail,
      updateUserPassword,
      toggleFavorite,
      startTrial,
      resendVerificationEmail,
      logout
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}