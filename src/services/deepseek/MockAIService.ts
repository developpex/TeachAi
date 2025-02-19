import { getRandomResponse } from './mockResponses';

export class MockAIService {
  private static instance: MockAIService;
  private conversationHistory: { role: string; content: string }[] = [];

  private constructor() {
    console.log('🔧 Mock AI Service initialized');
  }

  public static getInstance(): MockAIService {
    if (!MockAIService.instance) {
      MockAIService.instance = new MockAIService();
    }
    return MockAIService.instance;
  }

  async generateResponse(prompt: string): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.conversationHistory.push({ role: "user", content: prompt });
    
    // Get a random response based on the prompt
    const response = getRandomResponse(prompt);
    
    this.conversationHistory.push({ role: "assistant", content: response });
    return response;
  }

  clearConversation() {
    console.log('🧹 Clearing conversation history');
    this.conversationHistory = [];
  }
}