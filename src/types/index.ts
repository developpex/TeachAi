import { Timestamp } from 'firebase/firestore';

export type ToolFieldType = 'input' | 'textarea' | 'select';

export interface ToolField {
  label: string;
  placeholder: string;
  type: ToolFieldType;
  options?: string[];
  isSubjectField?: boolean;  // New flag to identify subject selection fields
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  createdAt: number;
  channelId: string;
}

export interface Channel {
  id: string;
  name: string;
  category: string;
  description: string;
  members: number;
  lastMessage?: {
    content: string;
    createdAt: number;
    userDisplayName: string;
  };
}

export interface Tool {
  id: string;
  name: string;
  navigation: string;
  description: string;
  icon: string;
  category: 'free' | 'plus' | 'enterprise';
  toolCategory: string;
  fields: ToolField[];
  isFavorite?: boolean;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  recommended?: boolean;
  period?: string;
}

export interface Subject {
  id: string;
  name: string;
  createdAt: Date;
}