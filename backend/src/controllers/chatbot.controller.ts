import { Request, Response } from 'express';
import llmService from '../services/llm.service';

// Chat message interface
interface ChatRequest {
  message: string;
  context?: {
    scanResults?: any;
    plantType?: string;
    location?: string;
    weather?: any;
  };
  sessionId?: string;
}

// Chat response interface
interface ChatResponse {
  success: boolean;
  data?: {
    answer: string;
    sources: string[];
    confidence: number;
    suggestions?: string[];
    relatedInfo?: {
      type: 'disease' | 'treatment' | 'prevention' | 'care';
      title: string;
      description: string;
    };
  };
  error?: string;
}

/**
 * Generate chat response using LLM service
 */
export const generateChatResponse = async (req: Request, res: Response) => {
  try {
    const { message, context, sessionId }: ChatRequest = req.body;
    // Validate input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string'
      });
    }

    // Check if LLM service is ready
    if (!(await llmService.isReady())) {
      return res.status(503).json({
        success: false,
        error: 'Chatbot service is not ready. Please try again later.'
      });
    }

    // Generate response using LLM service
    const ragResponse = await llmService.generateResponse(message, context);

    // Generate suggestions based on the response
    const suggestions = generateSuggestions(message, ragResponse.answer, context);

    // Generate related info if applicable
    const relatedInfo = generateRelatedInfo(ragResponse.sources, context);

    const response: ChatResponse = {
      success: true,
      data: {
        answer: ragResponse.answer,
        sources: ragResponse.sources,
        confidence: ragResponse.confidence,
        suggestions,
        relatedInfo
      }
    };

    res.json(response);

  } catch (error) {
    console.error('❌ Chatbot controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate response. Please try again.'
    });
  }
};

/**
 * Get conversation history
 */
export const getConversationHistory = async (req: Request, res: Response) => {
  try {
    const history = llmService.getConversationHistory();
    
    res.json({
      success: true,
      data: {
        messages: history,
        totalMessages: history.length
      }
    });

  } catch (error) {
    console.error('❌ Error getting conversation history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve conversation history'
    });
  }
};

/**
 * Clear conversation history
 */
export const clearConversationHistory = async (req: Request, res: Response) => {
  try {
    llmService.clearConversationHistory();
    
    res.json({
      success: true,
      message: 'Conversation history cleared successfully'
    });

  } catch (error) {
    console.error('❌ Error clearing conversation history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear conversation history'
    });
  }
};

/**
 * Get chatbot health status
 */
export const getChatbotHealth = async (req: Request, res: Response) => {
  try {
    const health = await llmService.healthCheck();
    
    res.json({
      success: true,
      data: health
    });

  } catch (error) {
    console.error('❌ Error checking chatbot health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check chatbot health'
    });
  }
};

/**
 * Generate contextual suggestions based on the conversation
 */
function generateSuggestions(userMessage: string, aiResponse: string, context?: any): string[] {
  const suggestions: string[] = [];
  const lowerMessage = userMessage.toLowerCase();
  const lowerResponse = aiResponse.toLowerCase();

  // Disease-specific suggestions
  if (lowerMessage.includes('symptom') || lowerResponse.includes('symptom')) {
    suggestions.push('What are the early warning signs?');
    suggestions.push('How quickly do symptoms progress?');
    suggestions.push('Are there similar diseases to watch for?');
  }

  // Treatment suggestions
  if (lowerMessage.includes('treat') || lowerResponse.includes('treatment')) {
    suggestions.push('What are the organic treatment options?');
    suggestions.push('How long does treatment take?');
    suggestions.push('When should I seek professional help?');
  }

  // Prevention suggestions
  if (lowerMessage.includes('prevent') || lowerResponse.includes('prevention')) {
    suggestions.push('What are the best prevention practices?');
    suggestions.push('How often should I inspect my plants?');
    suggestions.push('Are there resistant plant varieties?');
  }

  // Care suggestions
  if (lowerMessage.includes('care') || lowerResponse.includes('care')) {
    suggestions.push('What is the optimal watering schedule?');
    suggestions.push('What soil conditions are best?');
    suggestions.push('How much sunlight does it need?');
  }

  // Weather-related suggestions
  if (context?.weather) {
    suggestions.push('How does current weather affect my plants?');
    suggestions.push('What weather conditions should I watch for?');
  }

  // Plant type specific suggestions
  if (context?.plantType) {
    suggestions.push(`What are common issues with ${context.plantType}?`);
    suggestions.push(`How do I care for ${context.plantType} specifically?`);
  }

  // Default suggestions if none match
  if (suggestions.length === 0) {
    suggestions.push(
      'Tell me more about this disease',
      'What are the treatment options?',
      'How can I prevent this?',
      'What care does my plant need?'
    );
  }

  return suggestions.slice(0, 4); // Limit to 4 suggestions
}

/**
 * Generate related information based on sources and context
 */
function generateRelatedInfo(sources: string[], context?: any): any {
  if (sources.length === 0) return null;

  const primarySource = sources[0];
  
  // Determine info type based on source and context
  let type: 'disease' | 'treatment' | 'prevention' | 'care' = 'disease';
  
  if (context?.scanResults) {
    type = 'treatment';
  } else if (context?.weather) {
    type = 'prevention';
  }

  return {
    type,
    title: `Learn more about ${primarySource}`,
    description: `Get detailed information about ${primarySource} including symptoms, treatments, and prevention methods.`
  };
} 