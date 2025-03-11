import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  deleteDoc,
  query,
  Timestamp,
  writeBatch,
  where
} from 'firebase/firestore';
import { auth } from '../config/firebase';
import { Subject } from '../types';

export class SubjectService {
  private static instance: SubjectService;
  private db = getFirestore();

  private constructor() {}

  public static getInstance(): SubjectService {
    if (!SubjectService.instance) {
      SubjectService.instance = new SubjectService();
    }
    return SubjectService.instance;
  }

  async getSchoolSubjects(schoolId: string): Promise<Subject[]> {
    try {
      const subjectsRef = collection(this.db, `school_subjects/${schoolId}/subjects`);
      const q = query(subjectsRef);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      })) as Subject[];
    } catch (error) {
      console.error('Error getting school subjects:', error);
      throw error;
    }
  }

  async createSubject(schoolId: string, subject: Omit<Subject, 'id' | 'createdAt'>): Promise<Subject> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to create subjects');
    }

    try {
      const subjectsRef = collection(this.db, `school_subjects/${schoolId}/subjects`);
      const docRef = await addDoc(subjectsRef, {
        ...subject,
        createdAt: Timestamp.now()
      });

      return {
        id: docRef.id,
        ...subject,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error creating subject:', error);
      throw error;
    }
  }

  async deleteSubject(schoolId: string, subjectId: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to delete subjects');
    }

    try {
      const batch = writeBatch(this.db);

      // Delete the subject
      const subjectRef = doc(this.db, `school_subjects/${schoolId}/subjects/${subjectId}`);
      batch.delete(subjectRef);

      // Get all users that have this subject
      const usersRef = collection(this.db, 'users');
      const usersQuery = query(usersRef, where('schoolId', '==', schoolId));
      const usersSnapshot = await getDocs(usersQuery);

      // Remove the subject from each user's subjects array
      usersSnapshot.docs.forEach(userDoc => {
        const userData = userDoc.data();
        if (userData.subjects && userData.subjects.includes(subjectId)) {
          const updatedSubjects = userData.subjects.filter((id: string) => id !== subjectId);
          batch.update(userDoc.ref, { 
            subjects: updatedSubjects,
            updatedAt: Timestamp.now()
          });
        }
      });

      // Commit all changes in a single batch
      await batch.commit();
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
  }
}