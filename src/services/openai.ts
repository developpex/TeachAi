import { OpenAIResponse } from '../types';

const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY; 

export class OpenAIService {
  private static instance: OpenAIService;
  private conversationHistory: { role: string; content: string }[] = [];

  private constructor() {
    console.log('🔧 OpenAI Service initialized');
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  async generateResponse(prompt: string): Promise<OpenAIResponse> {
    console.log('📨 Preparing OpenAI request');
    console.log('Current conversation history:', this.conversationHistory);
    
    // Add user's message to history
    this.conversationHistory.push({ role: "user", content: prompt });
    console.log('Updated conversation history:', this.conversationHistory);

    console.log('🌐 Making API request to OpenAI');
    const requestBody = {
      model: "gpt-4o-mini",
      messages: this.conversationHistory,
      temperature: 0.7,
    };
    console.log('Request body:', requestBody);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Received response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('❌ API Error:', errorData);
      throw new Error('Failed to generate response');
    }

    const data = await response.json();
    console.log('📦 Parsed response data:', data);
    
    // Add assistant's response to history
    if (data.choices[0]?.message) {
      this.conversationHistory.push(data.choices[0].message);
      console.log('Updated conversation history with assistant response:', this.conversationHistory);
    }

    return data;
  }

  async continueConversation(followUpPrompt: string): Promise<OpenAIResponse> {
    console.log('🔄 Continuing conversation with prompt:', followUpPrompt);
    return this.generateResponse(followUpPrompt);
  }

  clearConversation() {
    console.log('🧹 Clearing conversation history');
    this.conversationHistory = [];
  }
}