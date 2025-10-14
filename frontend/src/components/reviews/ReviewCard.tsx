import React from 'react';
import { ThumbsUp, Trash2 } from 'lucide-react';
import { Review } from '../../types';
import { Card } from '../common/Card';
import { RatingStars } from './RatingStars';
import { formatTimeAgo } from '../../utils/formatDate';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { SentimentBadge } from './SentimentBadge';
import { useSentimentAnalysis } from '../../hooks/useSentimentAnalysis';

interface ReviewCardProps {
  review: Review;
  onDelete?: (reviewId: string) => void;
  onHelpful?: (reviewId: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onDelete,
  onHelpful,
}) => {
  const { user } = useAuth();
  const isOwnReview = user?._id === review.userId || user?.id === review.userId;
  const { sentiment, loading: sentimentLoading } = useSentimentAnalysis(review.comment);

  return (
    <Card padding="md" className="border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
              {(review.user?.name || review.userName)?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {review.user?.name || review.userName || 'Anonymous User'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatTimeAgo(review.created_at || review.createdAt || '')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <RatingStars rating={review.rating} />
            {sentiment && !sentimentLoading && (
              <SentimentBadge sentiment={sentiment} size="sm" />
            )}
          </div>
        </div>

        {isOwnReview && onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(review.id || review._id!)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment}</p>

      {onHelpful && (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onHelpful(review.id || review._id!)}
            className="text-gray-600 dark:text-gray-400"
          >
            <ThumbsUp size={16} className="mr-1" />
            Helpful ({review.helpful || 0})
          </Button>
        </div>
      )}

      {review.status === 'PENDING' && (
        <div className="mt-3 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
          Pending Approval
        </div>
      )}
    </Card>
  );
};





