import React from 'react';
import { Review } from '../../types';
import { ReviewCard } from './ReviewCard';
import { Loader } from '../common/Loader';

interface ReviewListProps {
  reviews: Review[];
  loading?: boolean;
  onDelete?: (reviewId: string) => void;
  onHelpful?: (reviewId: string) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  loading = false,
  onDelete,
  onHelpful,
}) => {
  console.log('ReviewList: Received reviews:', reviews);
  console.log('ReviewList: Reviews count:', reviews.length);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader size="md" text="Loading reviews..." />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-3">💬</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Reviews Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Be the first to share your thoughts about this animal!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id || review._id}
          review={review}
          onDelete={onDelete}
          onHelpful={onHelpful}
        />
      ))}
    </div>
  );
};






