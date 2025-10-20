import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ReviewFormData } from '../../types';
import { Button } from '../common/Button';
import { RatingStars } from './RatingStars';
import { Card } from '../common/Card';

interface ReviewFormProps {
  animalId: string;
  onSubmit: (data: ReviewFormData & { isAnonymous?: boolean }) => Promise<void>;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ animalId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<{ comment: string }>();

  const handleFormSubmit = async (data: { comment: string }) => {
    if (rating === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        animalId,
        rating,
        comment: data.comment,
        isAnonymous,
      };
      await onSubmit(reviewData);
      reset();
      setRating(0);
      setIsAnonymous(false);
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card padding="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <RatingStars rating={rating} interactive onRatingChange={setRating} size={24} />
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            rows={4}
            {...register('comment', {
              required: 'Review comment is required',
              minLength: {
                value: 10,
                message: 'Review must be at least 10 characters long',
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
            placeholder="Share your experience with this animal..."
          />
          {errors.comment && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.comment.message}
            </p>
          )}
        </div>

        {/* Anonymous toggle */}
        <div className="flex items-center space-x-2">
          <input
            id="anonymous"
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="anonymous" className="text-sm text-gray-700 dark:text-gray-300">
            Post anonymously
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isSubmitting}
        >
          Submit Review
        </Button>
      </form>
    </Card>
  );
};






