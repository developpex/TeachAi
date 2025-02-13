export type ToolFieldType = 'input' | 'textarea' | 'select';

export interface ToolField {
  label: string;
  placeholder: string;
  type: ToolFieldType;
  options?: string[]; // For select type fields
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

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

export interface DeepSeekAIResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export interface DeepSeekAIStreamResponse {
  model: string;
  created_at: string;
  message?: {
    role: string;
    content: string;
  };
  done: boolean;
}



export interface Tool {
  id: string;
  name: string;
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