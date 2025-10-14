import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ReviewFormData } from '../../types';
import { Button } from '../common/Button';
import { RatingStars } from './RatingStars';
import { Card } from '../common/Card';

interface ReviewFormProps {
  animalId: string;
  onSubmit: (data: ReviewFormData) => Promise<void>;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ animalId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<{ comment: string }>();

  const handleFormSubmit = async (data: { comment: string }) => {
    console.log('ReviewForm: handleFormSubmit called with:', data);
    console.log('ReviewForm: rating is:', rating);
    
    if (rating === 0) {
      console.log('ReviewForm: No rating selected, returning');
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        animalId,
        rating,
        comment: data.comment,
      };
      console.log('ReviewForm: Submitting review data:', reviewData);
      await onSubmit(reviewData);
      console.log('ReviewForm: Review submitted successfully');
      reset();
      setRating(0);
    } catch (error) {
      console.error('ReviewForm: Error submitting review:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card padding="md">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Write a Review
      </h3>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-2">
            <RatingStars
              rating={rating}
              interactive
              onRatingChange={setRating}
              size={28}
            />
            {rating > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({rating} out of 5)
              </span>
            )}
          </div>
          {rating === 0 && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Please select a rating
            </p>
          )}
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

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isSubmitting}
          disabled={rating === 0 || isSubmitting}
        >
          Submit Review
        </Button>
      </form>
    </Card>
  );
};




