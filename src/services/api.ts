import { API_CONFIG } from '../config/api';

export class APIService {
  private static instance: APIService;

  private constructor() {}

  public static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  public async generateToolResponse(toolId: string, formData: Record<string, any>): Promise<ReadableStream<Uint8Array> | null> {
    try {
      const requestData = {
        ...formData,
        isFollowUp: !!formData.prompt // Determine if this is a follow-up request
      };

      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.tools}/${toolId}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(errorData.error || 'Request failed');
      }

      return response.body;
    } catch (error) {
      console.error('Error generating tool response:', error);
      throw error;
    }
  }

  public async clearConversation(toolId: string, userId: string): Promise<void> {
    try {
      await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.tools}/${toolId}/clear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  }
}
