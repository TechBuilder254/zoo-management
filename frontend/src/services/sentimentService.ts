// Sentiment Analysis Service using Hugging Face

import { HfInference } from '@huggingface/inference';
import { SentimentResult } from '../types/ai';
import aiService from './aiService';

class SentimentService {
  private hf: HfInference | null = null;
  private cache = new Map<string, { result: SentimentResult; timestamp: number }>();
  private cacheTTL = 10 * 60 * 1000; // 10 minutes

  constructor() {
    const apiKey = process.env.REACT_APP_HUGGINGFACE_API_KEY;
    if (apiKey) {
      this.hf = new HfInference(apiKey);
    }
  }

  async analyze(text: string): Promise<SentimentResult> {
    if (!aiService.isFeatureEnabled('enableSentiment')) {
      return this.getFallbackSentiment(text);
    }

    if (!this.hf) {
      console.warn('Hugging Face API key not configured, using fallback');
      return this.getFallbackSentiment(text);
    }

    // Check cache
    const cached = this.cache.get(text);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.result;
    }

    try {
      const result = await aiService.retryWithBackoff(async () => {
        return await this.hf!.textClassification({
          model: 'distilbert-base-uncased-finetuned-sst-2-english',
          inputs: text,
        });
      });

      if (!result || result.length === 0) {
        return this.getFallbackSentiment(text);
      }

      // Get the highest scoring label
      const topResult = result.reduce((prev, current) => 
        current.score > prev.score ? current : prev
      );

      const sentiment: SentimentResult = {
        label: this.mapLabel(topResult.label),
        score: topResult.score,
      };

      // Cache the result
      this.cache.set(text, { result: sentiment, timestamp: Date.now() });

      return sentiment;
    } catch (error) {
      aiService.handleError(error, 'Sentiment Analysis');
      return this.getFallbackSentiment(text);
    }
  }

  private mapLabel(label: string): 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' {
    const normalizedLabel = label.toUpperCase();
    if (normalizedLabel.includes('POSITIVE')) return 'POSITIVE';
    if (normalizedLabel.includes('NEGATIVE')) return 'NEGATIVE';
    return 'NEUTRAL';
  }

  // Simple fallback sentiment analysis using keyword matching
  private getFallbackSentiment(text: string): SentimentResult {
    const lowerText = text.toLowerCase();
    
    const positiveWords = [
      'great', 'amazing', 'excellent', 'wonderful', 'fantastic', 
      'love', 'awesome', 'beautiful', 'perfect', 'best', 'good',
      'enjoy', 'happy', 'incredible', 'outstanding'
    ];
    
    const negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate',
      'poor', 'disappointing', 'disappointed', 'disgusting',
      'pathetic', 'useless', 'waste', 'never'
    ];

    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++;
    });

    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++;
    });

    if (positiveCount > negativeCount) {
      return {
        label: 'POSITIVE',
        score: Math.min(0.6 + (positiveCount * 0.05), 0.85),
        fallback: true,
      };
    } else if (negativeCount > positiveCount) {
      return {
        label: 'NEGATIVE',
        score: Math.min(0.6 + (negativeCount * 0.05), 0.85),
        fallback: true,
      };
    } else {
      return {
        label: 'NEUTRAL',
        score: 0.5,
        fallback: true,
      };
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

const sentimentService = new SentimentService();
export default sentimentService;


