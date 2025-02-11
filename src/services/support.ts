import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  Timestamp,
  writeBatch,
  doc,
  getDoc,
  arrayUnion,
  deleteDoc,
  updateDoc,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  onSnapshot
} from 'firebase/firestore';
import { auth } from '../config/firebase';
import { SupportService as ModularSupportService } from './support/index';

// Re-export types from modular structure
export type { SupportTicket } from './support/types';

// Re-export the SupportService class
export const SupportService = ModularSupportService;