import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Chat message interface
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// RAG response interface
interface RAGResponse {
  answer: string;
  sources: string[];
  confidence: number;
}

class LLMService {
  private conversationHistory: ChatMessage[] = [];
  private isInitialized = false;
  private readonly groqApiKey: string;
  private readonly model = 'llama3-8b-8192'; // Use 'llama3-70b-8192' for higher quality
  private readonly apiBaseUrl = 'https://api.groq.com/openai/v1';

  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY?.trim() || "";

    if (!this.groqApiKey) {
      console.error('❌ GROQ_API_KEY is missing from environment variables');
      throw new Error('GROQ_API_KEY is required to initialize LLMService');
    }

    this.initializeLLM();
  }

  /**
   * Initialize the LLM service
   */
  private async initializeLLM() {
    try {
      console.log('🚀 Initializing LLM service with Groq (Llama 3)...');

      if (await this.testGroqAPI()) {
        console.log(`✅ LLM initialized successfully with Groq (${this.model})`);
      this.isInitialized = true;
      } else {
        throw new Error('Groq API test failed');
      }
    } catch (error) {
      console.error('❌ LLM initialization failed:', error);
      throw new Error('Failed to initialize LLM service. Check GROQ_API_KEY and internet.');
    }
  }

  /**
   * Test if Groq API is working
   */
  private async testGroqAPI(): Promise<boolean> {
    try {
      console.log('🔍 Testing Groq API...');

      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            { role: 'user', content: 'Say "OK" if working.' }
          ],
          max_tokens: 10,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.groqApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      const text = response.data.choices?.[0]?.message?.content;
      if (text && typeof text === 'string') {
        console.log('✅ Groq API test successful');
        return true;
      }
      return false;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;
        console.error(`❌ Groq API test failed [${status}]:`, data || error.message);
      } else {
        console.error('❌ Unexpected error:', error);
      }
      return false;
    }
  }

  /**
   * Call Groq API with a prompt
   */
  private async callGroqAPI(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a plant disease expert. Be helpful, accurate, and practical.'
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.5,
          max_tokens: 1024,
          top_p: 0.9,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.groqApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      const text = response.data.choices[0].message.content;
      if (!text) {
        throw new Error('Empty or invalid response from Groq API');
      }

      return text.trim();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;
        throw new Error(
          `Groq API error [${status}]: ` +
          (typeof data === 'string' ? data : JSON.stringify(data) || error.message)
        );
      }
      throw new Error(`Unexpected error in callGroqAPI: ${error}`);
    }
  }

  /**
   * Generate response using Llama 3 for plant disease expertise
   */
  async generateResponse(userMessage: string, context?: any): Promise<RAGResponse> {
    try {
      if (!this.isInitialized) {
        throw new Error('LLM service not initialized. Wait for startup or check API key.');
      }

      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      });

      // Build context from recent messages
      const recentContext = this.conversationHistory
        .slice(-6)
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      // Specialized prompt for plant disease expert
      const fullPrompt = `
You are an expert plant pathologist and horticulturist. Diagnose and advise on plant diseases with precision.

Specialize in:
- Identifying diseases from symptoms
- Recommending organic & chemical treatments
- Prevention strategies and cultural practices
- Environmental factors (humidity, pests, soil)
- Sustainable, science-backed advice

If unsure, say so. Avoid guessing.

Recent conversation:
${recentContext}

User question: ${userMessage}

Provide a clear, concise, and helpful answer:
      `.trim();

      const responseText = await this.callGroqAPI(fullPrompt);

      // Add assistant response
      this.conversationHistory.push({
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      });

      // Limit history to prevent memory issues
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      return {
        answer: responseText,
        sources: ['Groq AI - Llama 3 - Plant Disease Expert'],
        confidence: 0.8, // Adjust based on model reliability
      };
    } catch (error) {
      console.error('❌ Error generating response:', error);
      throw new Error(
        `Failed to generate response: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Get conversation history
   */
  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  /**
   * Clear conversation history
   */
  clearConversationHistory() {
    this.conversationHistory = [];
  }

  /**
   * Check if LLM service is ready
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Health check for the LLM service
   */
  async healthCheck(): Promise<{ status: string; message: string; details?: any }> {
    try {
      if (!this.isInitialized) {
        return { status: 'error', message: 'LLM service not initialized' };
      }

      await this.callGroqAPI('Say "OK" if healthy.');
      
      return {
        status: 'healthy',
        message: 'LLM service is working correctly with Groq (Llama 3)',
        details: {
          provider: 'Groq',
          model: this.model,
          conversationHistorySize: this.conversationHistory.length,
          specialization: 'plant-disease-expert',
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: 'LLM service health check failed',
        details: { 
          error: error.message,
          provider: 'Groq',
          model: this.model,
        },
      };
    }
  }
}

// Export singleton instance
export const llmService = new LLMService();
export default llmService; 