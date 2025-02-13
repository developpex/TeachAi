import { DeepSeekAIStreamResponse } from '../types';

export class DeepseekAIService {
  private static instance: AIService;
  private conversationHistory: { role: string; content: string }[] = [];

  private constructor() {
    console.log('🔧 AI Service (Ollama) initialized');
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateResponse(prompt: string, onStreamUpdate: (text: string) => void): Promise<void> {
    console.log('📨 Sending request to Ollama (streaming enabled)');

    // Add user's message to history
    this.conversationHistory.push({ role: "user", content: prompt });

    const requestBody = {
      model: "deepseek-r1:1.5b",
      messages: this.conversationHistory,
      stream: true
    };

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok || !response.body) {
      const errorData = await response.json().catch(() => null);
      console.error('❌ API Error:', errorData);
      throw new Error('Failed to generate response from DeepSeek');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantResponse = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsedLine: DeepSeekAIStreamResponse = JSON.parse(line);
          if (parsedLine.message?.content) {
            assistantResponse += parsedLine.message.content;
            onStreamUpdate(assistantResponse); // Update UI with partial response
          }
        } catch (error) {
          console.warn("⚠️ Error parsing streamed chunk:", error);
        }
      }
    }

    // Store assistant response in history for follow-up questions
    if (assistantResponse.trim()) {
      this.conversationHistory.push({ role: "assistant", content: assistantResponse });
    }

    console.log("✅ Streaming complete. Final response:", assistantResponse);
  }

  clearConversation() {
    console.log('🧹 Clearing conversation history');
    this.conversationHistory = [];
  }
}
