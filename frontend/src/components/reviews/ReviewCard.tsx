import React from 'react';
import { ThumbsUp, Trash2, Pencil } from 'lucide-react';
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
  onUpdate?: (reviewId: string, data: { rating?: number; comment?: string }) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onDelete,
  onHelpful,
  onUpdate,
}) => {
  const { user } = useAuth();
  const isOwnReview = user?.id === (review.user_id || review.userId);

  const [isEditing, setIsEditing] = React.useState(false);
  const [editComment, setEditComment] = React.useState(review.comment);
  const [editRating, setEditRating] = React.useState<number>(review.rating);

  const handleSave = () => {
    if (!onUpdate) return;
    onUpdate(review.id || (review as any)._id, { rating: editRating, comment: editComment });
    setIsEditing(false);
  };

  const { sentiment, loading: sentimentLoading } = useSentimentAnalysis(review.comment);

  return (
    <Card padding="md" className="border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
              {(review.user?.name || (review as any).userName)?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {review.user?.name || (review as any).userName || 'Anonymous User'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatTimeAgo(review.created_at || (review as any).createdAt || '')}
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

        {isOwnReview && (
          <div className="flex items-center gap-2">
            {onUpdate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing((v) => !v)}
                className="text-gray-600 hover:text-gray-800"
              >
                <Pencil size={16} />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(review.id || (review as any)._id!)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 text-gray-900 dark:text-white"
            rows={3}
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Rating:</span>
            <input
              type="number"
              min={1}
              max={5}
              className="w-16 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-gray-900 dark:text-white"
              value={editRating}
              onChange={(e) => setEditRating(parseInt(e.target.value || '0', 10))}
            />
            <Button variant="primary" size="sm" onClick={handleSave}>Save</Button>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment}</p>
      )}

      {onHelpful && !isOwnReview && (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onHelpful(review.id || (review as any)._id!)}
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






