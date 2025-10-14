// AI/ML Related Types

export interface SentimentResult {
  label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  score: number;
  error?: boolean;
  fallback?: boolean;
}

export interface ToxicityResult {
  toxicity: number;
  severeToxicity: number;
  insult: number;
  profanity: number;
  isToxic: boolean;
  error?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface RecognitionResult {
  name: string;
  confidence: number;
}

export interface Recommendation {
  animalId: string;
  score: number;
  reason: string;
}

export interface AIConfig {
  enableSentiment: boolean;
  enableModeration: boolean;
  enableChatbot: boolean;
  sentimentThreshold: number;
  toxicityThreshold: number;
}


