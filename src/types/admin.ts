import { Timestamp } from 'firebase/firestore';

export interface School {
  id: string;
  name: string;
  domain?: string;
  maxUsers: number;
  ownerId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface User {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'user';
  schoolId: string | null;
  plan: 'free' | 'plus' | 'enterprise';
  subjects: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateSchoolData {
  name: string;
  domain?: string;
  maxUsers: number;
  adminEmail: string;
}

export interface AddUserData {
  email: string;
  role: 'admin' | 'user';
  schoolId: string;
  subjects: string[];
}