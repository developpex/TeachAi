import { 
  getFirestore, 
  doc,
  getDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
  Timestamp 
} from 'firebase/firestore';
import { auth } from '../config/firebase';

export interface SavedResponse {
  id: string;
  toolId: string;
  toolName: string;
  content: string;
  title: string;
  savedAt: Date;
}

export class HistoryService {
  private static instance: HistoryService;
  private db = getFirestore();

  private constructor() {}

  public static getInstance(): HistoryService {
    if (!HistoryService.instance) {
      HistoryService.instance = new HistoryService();
    }
    return HistoryService.instance;
  }

  private generateResponseId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private generateDefaultTitle(content: string): string {
    // Extract first line or first 50 characters
    const firstLine = content.split('\n')[0].trim();
    return firstLine.length > 50 ? firstLine.substring(0, 47) + '...' : firstLine;
  }

  public async saveResponse(
    toolId: string, 
    toolName: string, 
    content: string,
    title?: string
  ): Promise<string> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to save responses');
    }

    try {
      const responseId = this.generateResponseId();
      const userHistoryRef = doc(this.db, 'user_history', auth.currentUser.uid);
      
      const response = {
        id: responseId,
        toolId,
        toolName,
        content,
        title: title || this.generateDefaultTitle(content),
        savedAt: Timestamp.now()
      };

      // Get current document
      const docSnap = await getDoc(userHistoryRef);
      
      if (docSnap.exists()) {
        // Add to existing responses array
        await setDoc(userHistoryRef, {
          responses: arrayUnion(response)
        }, { merge: true });
      } else {
        // Create new document with responses array
        await setDoc(userHistoryRef, {
          responses: [response]
        });
      }

      return responseId;
    } catch (error) {
      console.error('Error saving response:', error);
      throw error;
    }
  }

  public async updateResponseTitle(responseId: string, newTitle: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to update responses');
    }

    try {
      const userHistoryRef = doc(this.db, 'user_history', auth.currentUser.uid);
      const docSnap = await getDoc(userHistoryRef);

      if (!docSnap.exists()) {
        throw new Error('No saved responses found');
      }

      const data = docSnap.data();
      const responses = data.responses || [];
      const responseIndex = responses.findIndex((r: any) => r.id === responseId);

      if (responseIndex === -1) {
        throw new Error('Response not found');
      }

      // Remove old response
      const oldResponse = responses[responseIndex];
      await setDoc(userHistoryRef, {
        responses: arrayRemove(oldResponse)
      }, { merge: true });

      // Add updated response
      const updatedResponse = {
        ...oldResponse,
        title: newTitle
      };
      await setDoc(userHistoryRef, {
        responses: arrayUnion(updatedResponse)
      }, { merge: true });

    } catch (error) {
      console.error('Error updating response title:', error);
      throw error;
    }
  }

  public async getSavedResponses(): Promise<SavedResponse[]> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to get saved responses');
    }

    try {
      const userHistoryRef = doc(this.db, 'user_history', auth.currentUser.uid);
      const docSnap = await getDoc(userHistoryRef);

      if (!docSnap.exists()) {
        return [];
      }

      const data = docSnap.data();
      return (data.responses || []).map((response: any) => ({
        ...response,
        savedAt: response.savedAt.toDate()
      }));
    } catch (error) {
      console.error('Error getting saved responses:', error);
      throw error;
    }
  }

  public async removeResponse(responseId: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to remove responses');
    }

    try {
      const userHistoryRef = doc(this.db, 'user_history', auth.currentUser.uid);
      const docSnap = await getDoc(userHistoryRef);

      if (!docSnap.exists()) {
        return;
      }

      const data = docSnap.data();
      const responseToRemove = data.responses.find((r: any) => r.id === responseId);

      if (responseToRemove) {
        await setDoc(userHistoryRef, {
          responses: arrayRemove(responseToRemove)
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error removing response:', error);
      throw error;
    }
  }
}