import React from 'react';
import { SentimentResult } from '../../types/ai';

interface SentimentBadgeProps {
  sentiment: SentimentResult;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SentimentBadge: React.FC<SentimentBadgeProps> = ({ 
  sentiment, 
  showScore = true,
  size = 'md' 
}) => {
  const config = {
    POSITIVE: {
      emoji: '😊',
      color: 'bg-green-100 text-green-800 border-green-200',
      text: 'Positive',
      darkColor: 'dark:bg-green-900 dark:text-green-100 dark:border-green-700',
    },
    NEGATIVE: {
      emoji: '😞',
      color: 'bg-red-100 text-red-800 border-red-200',
      text: 'Negative',
      darkColor: 'dark:bg-red-900 dark:text-red-100 dark:border-red-700',
    },
    NEUTRAL: {
      emoji: '😐',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      text: 'Neutral',
      darkColor: 'dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600',
    },
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const { emoji, color, text, darkColor } = config[sentiment.label];
  const sizeClass = sizeClasses[size];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium border
        ${color} ${darkColor} ${sizeClass}
        transition-all duration-200
      `}
      title={sentiment.fallback ? 'Sentiment detected using fallback method' : 'AI-detected sentiment'}
    >
      <span className="leading-none">{emoji}</span>
      <span>{text}</span>
      {showScore && (
        <span className="opacity-75">
          ({Math.round(sentiment.score * 100)}%)
        </span>
      )}
      {sentiment.fallback && (
        <span className="text-xs opacity-60" title="Fallback mode">
          *
        </span>
      )}
    </span>
  );
};


