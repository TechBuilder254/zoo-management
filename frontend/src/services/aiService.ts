// Base AI Service with common utilities

import { AIConfig } from '../types/ai';

class AIService {
  private config: AIConfig;

  constructor() {
    this.config = {
      enableSentiment: process.env.REACT_APP_ENABLE_SENTIMENT_ANALYSIS === 'true',
      enableModeration: process.env.REACT_APP_ENABLE_CONTENT_MODERATION === 'true',
      enableChatbot: process.env.REACT_APP_ENABLE_CHATBOT === 'true',
      sentimentThreshold: parseFloat(process.env.REACT_APP_SENTIMENT_THRESHOLD || '0.7'),
      toxicityThreshold: parseFloat(process.env.REACT_APP_TOXICITY_THRESHOLD || '0.8'),
    };
  }

  getConfig(): AIConfig {
    return this.config;
  }

  isFeatureEnabled(feature: keyof AIConfig): boolean {
    return this.config[feature] as boolean;
  }

  // Retry logic with exponential backoff
  async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (maxRetries === 0) throw error;
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.retryWithBackoff(fn, maxRetries - 1, delay * 2);
    }
  }

  // Handle API errors gracefully
  handleError(error: any, context: string): void {
    console.error(`AI Service Error [${context}]:`, error);
    
    // You could send to error tracking service here
    // Example: Sentry.captureException(error);
  }
}

const aiService = new AIService();
export default aiService;


