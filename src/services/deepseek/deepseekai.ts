import { DeepSeekAIResponse } from '../../types';

export class DeepseekAIService {
  private static instance: DeepseekAIService;
  private conversationHistory: { role: string; content: string }[] = [];
  private readonly OLLAMA_URL = 'http://localhost:11434/api/generate'; // ✅ Correct endpoint

  private constructor() {
    console.log('🔧 AI Service (Ollama) initialized');
  }

  public static getInstance(): DeepseekAIService {
    if (!DeepseekAIService.instance) {
      DeepseekAIService.instance = new DeepseekAIService();
    }
    return DeepseekAIService.instance;
  }

  private async checkOllamaConnection(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:11434/api/tags', { method: 'GET' }).catch(() => null);
      return response?.ok ?? false;
    } catch {
      return false;
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      console.log('📨 Checking Ollama connection...');
      const isConnected = await this.checkOllamaConnection();
      if (!isConnected) {
        throw new Error('Cannot connect to Ollama server. Please ensure Ollama is running on your system.');
      }
  
      this.conversationHistory.push({ role: "user", content: prompt });
  
      const requestBody = {
        model: "deepseek-r1:1.5b",
        prompt,
        stream: false
      };
  
      console.log('📨 Sending request to Ollama...');
      const response = await fetch(this.OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('❌ API Error:', errorData);
        throw new Error(errorData?.error || 'Failed to generate response from Ollama');
      }
  
      const responseData = await response.json(); // ✅ Get the full response object
  
      if (responseData.response) {
        this.conversationHistory.push({ role: "assistant", content: responseData.response });
        return responseData.response; // ✅ Return only the response content
      }
  
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('❌ Error in generateResponse:', error);
      throw error;
    }
  }
  

  clearConversation() {
    console.log('🧹 Clearing conversation history');
    this.conversationHistory = [];
  }
}
