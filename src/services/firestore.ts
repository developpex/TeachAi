import { getFirestore, collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
import { Tool, Channel } from '../types';
import { allTools } from '../data/tools';

const db = getFirestore();

const defaultChannels: Omit<Channel, 'id'>[] = [
  {
    name: 'general',
    category: 'General',
    description: 'General discussion for all teachers',
    members: 0
  },
  {
    name: 'lesson-planning',
    category: 'Education',
    description: 'Share and discuss lesson planning strategies',
    members: 0
  },
  {
    name: 'tech-support',
    category: 'General',
    description: 'Get help with TeachAI tools and features',
    members: 0
  },
  {
    name: 'elementary',
    category: 'Education',
    description: 'Elementary school teachers discussion',
    members: 0
  },
  {
    name: 'middle-school',
    category: 'Education',
    description: 'Middle school teachers discussion',
    members: 0
  },
  {
    name: 'high-school',
    category: 'Education',
    description: 'High school teachers discussion',
    members: 0
  },
  {
    name: 'homework-help',
    category: 'Students',
    description: 'Discuss homework strategies and tips',
    members: 0
  },
  {
    name: 'classroom-management',
    category: 'Education',
    description: 'Share classroom management techniques',
    members: 0
  }
];

export class FirestoreService {
  private static instance: FirestoreService;

  private constructor() {
    this.initializeTools();
    this.initializeChannels();
  }

  public static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      FirestoreService.instance = new FirestoreService();
    }
    return FirestoreService.instance;
  }

  private async initializeTools() {
    try {
      const toolsRef = collection(db, 'tools');
      const snapshot = await getDocs(toolsRef);
      
      if (snapshot.empty) {
        console.log('Initializing tools collection...');
        const batch = allTools.map(tool => 
          setDoc(doc(toolsRef, tool.id), tool)
        );
        await Promise.all(batch);
        console.log('Tools collection initialized');
      }
    } catch (error) {
      console.error('Error initializing tools:', error);
    }
  }

  private async initializeChannels() {
    try {
      const channelsRef = collection(db, 'channels');
      const snapshot = await getDocs(channelsRef);
      
      if (snapshot.empty) {
        console.log('Initializing channels collection...');
        const batch = defaultChannels.map(channel => 
          setDoc(doc(channelsRef), channel)
        );
        await Promise.all(batch);
        console.log('Channels collection initialized');
      }
    } catch (error) {
      console.error('Error initializing channels:', error);
    }
  }

  async getAllTools(): Promise<Tool[]> {
    try {
      const toolsRef = collection(db, 'tools');
      const snapshot = await getDocs(toolsRef);
      return snapshot.docs.map(doc => doc.data() as Tool);
    } catch (error) {
      console.error('Error fetching tools:', error);
      return [];
    }
  }

  async getToolsByCategory(category: string): Promise<Tool[]> {
    try {
      const toolsRef = collection(db, 'tools');
      const q = query(toolsRef, where('category', '==', category));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Tool);
    } catch (error) {
      console.error('Error fetching tools by category:', error);
      return [];
    }
  }

  async getToolsByToolCategory(toolCategory: string): Promise<Tool[]> {
    try {
      const toolsRef = collection(db, 'tools');
      const q = query(toolsRef, where('toolCategory', '==', toolCategory));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Tool);
    } catch (error) {
      console.error('Error fetching tools by tool category:', error);
      return [];
    }
  }
}