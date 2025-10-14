// Custom hook for sentiment analysis

import { useState, useEffect } from 'react';
import { SentimentResult } from '../types/ai';
import sentimentService from '../services/sentimentService';

interface UseSentimentAnalysisResult {
  sentiment: SentimentResult | null;
  loading: boolean;
  error: Error | null;
  analyze: (text: string) => Promise<void>;
}

export const useSentimentAnalysis = (text?: string): UseSentimentAnalysisResult => {
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const analyze = async (textToAnalyze: string) => {
    if (!textToAnalyze || textToAnalyze.trim().length === 0) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await sentimentService.analyze(textToAnalyze);
      setSentiment(result);
    } catch (err) {
      setError(err as Error);
      console.error('Sentiment analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (text && text.trim().length > 0) {
      analyze(text);
    }
  }, [text]);

  return { sentiment, loading, error, analyze };
};


