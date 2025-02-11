import { 
  getDatabase, 
  ref, 
  push,
  set,
  onValue,
  query,
  orderByChild,
  off,
  serverTimestamp,
  update,
  get
} from 'firebase/database';
import { database, auth } from '../config/firebase';
import type { ChatMessage, Channel } from '../types';

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

export class ChatService {
  private static instance: ChatService;
  private messageRefs: { [key: string]: any } = {};
  private channelRef: any;

  private constructor() {
    this.initializeDefaultChannels();
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private async initializeDefaultChannels() {
    if (!auth.currentUser) return;

    try {
      const channelsRef = ref(database, 'channels');
      const snapshot = await get(channelsRef);

      if (!snapshot.exists()) {
        console.log('Initializing default channels...');
        const promises = defaultChannels.map(channel => {
          const newChannelRef = push(channelsRef);
          return set(newChannelRef, {
            ...channel,
            lastMessage: null
          });
        });
        await Promise.all(promises);
        console.log('Default channels initialized');
      }
    } catch (error) {
      console.error('Error initializing default channels:', error);
    }
  }

  subscribeToChannels(callback: (channels: Channel[]) => void): () => void {
    if (!auth.currentUser) return () => {};

    this.channelRef = ref(database, 'channels');
    
    const unsubscribe = onValue(this.channelRef, (snapshot) => {
      const channels: Channel[] = [];
      snapshot.forEach((childSnapshot) => {
        channels.push({
          id: childSnapshot.key!,
          ...childSnapshot.val()
        });
      });
      callback(channels);
    }, (error) => {
      console.error('Error in channels subscription:', error);
    });

    return () => {
      if (this.channelRef) {
        off(this.channelRef);
      }
    };
  }

  subscribeToMessages(channelId: string, callback: (messages: ChatMessage[]) => void): () => void {
    if (!channelId || !auth.currentUser) return () => {};

    const messagesRef = ref(database, `messages/${channelId}`);
    const messagesQuery = query(messagesRef, orderByChild('createdAt'));

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const messages: ChatMessage[] = [];
      snapshot.forEach((childSnapshot) => {
        const messageData = childSnapshot.val();
        if (messageData) {
          messages.push({
            id: childSnapshot.key!,
            channelId,
            ...messageData
          });
        }
      });
      callback(messages.sort((a, b) => {
        const timeA = a.createdAt || 0;
        const timeB = b.createdAt || 0;
        return timeA - timeB;
      }));
    }, (error) => {
      console.error('Error in messages subscription:', error);
    });

    this.messageRefs[channelId] = messagesRef;

    return () => {
      unsubscribe();
      delete this.messageRefs[channelId];
    };
  }

  async sendMessage(channelId: string, userId: string, content: string, userDisplayName: string, userPhotoURL?: string): Promise<void> {
    if (!channelId || !userId || !content || !userDisplayName || !auth.currentUser) {
      throw new Error('Missing required message parameters or not authenticated');
    }

    try {
      const timestamp = serverTimestamp();
      
      // Create message data
      const messageData = {
        userId,
        content,
        userDisplayName,
        userPhotoURL: userPhotoURL || null,
        createdAt: timestamp
      };

      // Create last message data
      const lastMessageData = {
        content,
        createdAt: timestamp,
        userDisplayName
      };

      // Create references
      const newMessageRef = push(ref(database, `messages/${channelId}`));
      
      // Create updates object
      const updates: { [key: string]: any } = {};
      updates[`messages/${channelId}/${newMessageRef.key}`] = messageData;
      updates[`channels/${channelId}/lastMessage`] = lastMessageData;

      // Perform atomic update
      await update(ref(database), updates);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}