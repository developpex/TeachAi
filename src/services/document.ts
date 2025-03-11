import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  getDocs,
  deleteDoc,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { auth } from '../config/firebase';

export interface SchoolDocument {
  id: string;
  name: string;
  fileId: string;
  subjectId: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export class DocumentService {
  private static instance: DocumentService;
  private db = getFirestore();

  private constructor() {}

  public static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  async getSchoolDocuments(schoolId: string): Promise<SchoolDocument[]> {
    try {
      const documentsRef = collection(this.db, `school_documents/${schoolId}/documents`);
      const q = query(documentsRef);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt.toDate()
      })) as SchoolDocument[];
    } catch (error) {
      console.error('Error getting school documents:', error);
      throw error;
    }
  }

  async addDocument(schoolId: string, document: Omit<SchoolDocument, 'id' | 'uploadedAt'>): Promise<SchoolDocument> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to add documents');
    }

    try {
      const documentsRef = collection(this.db, `school_documents/${schoolId}/documents`);
      const docRef = await addDoc(documentsRef, {
        ...document,
        uploadedAt: Timestamp.now()
      });

      return {
        id: docRef.id,
        ...document,
        uploadedAt: new Date()
      };
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  async deleteDocument(schoolId: string, documentId: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to delete documents');
    }

    try {
      const documentRef = doc(this.db, `school_documents/${schoolId}/documents/${documentId}`);
      await deleteDoc(documentRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}