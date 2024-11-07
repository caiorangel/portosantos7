import axios from 'axios';

interface ChatResponse {
  success: boolean;
  response?: string;
  error?: string;
}

class ChatService {
  private threadSlug: string | null = null;
  private readonly baseUrl = import.meta.env.PROD ? 
    'https://legendary-cactus-f097b6.netlify.app/.netlify/functions' : 
    '/.netlify/functions';

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/${endpoint}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error making request to ${endpoint}:`, error);
      
      // Provide fallback functionality
      if (endpoint === 'chat-proxy' && data.action === 'sendMessage') {
        return {
          success: true,
          response: 'Desculpe, estou temporariamente offline. Por favor, entre em contato pelo WhatsApp (13) 99126-0211.'
        };
      }
      throw error;
    }
  }

  async createThread(): Promise<void> {
    try {
      const response = await this.makeRequest('chat-proxy', {
        action: 'createThread'
      });
      this.threadSlug = response.threadSlug;
    } catch (error) {
      console.error('Failed to create thread, using fallback mode');
      this.threadSlug = 'fallback-' + Date.now();
    }
  }

  async sendMessage(message: string): Promise<ChatResponse> {
    if (!this.threadSlug) {
      await this.createThread();
    }

    try {
      const response = await this.makeRequest('chat-proxy', {
        action: 'sendMessage',
        message,
        threadSlug: this.threadSlug
      });

      return {
        success: true,
        response: response.response
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      return {
        success: true,
        response: 'Desculpe, estou com dificuldades para processar sua mensagem. Por favor, tente novamente ou entre em contato pelo WhatsApp (13) 99126-0211.'
      };
    }
  }

  async resetConversation(): Promise<void> {
    this.threadSlug = null;
    await this.createThread();
  }
}

export const chatService = new ChatService();