import React from 'react';
import { useForm } from 'react-hook-form';
import { Event } from '../../types/event';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface EventFormData {
  title: string;
  description: string;
  category: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
}

interface EventFormProps {
  event?: Event;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EventFormData>({
    defaultValues: event ? {
      title: event.title,
      description: event.description,
      category: event.category,
      eventDate: event.eventDate,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      capacity: event.capacity
    } : {
      title: '',
      description: '',
      category: 'Educational',
      eventDate: '',
      startTime: '',
      endTime: '',
      location: '',
      capacity: 0
    }
  });

  const handleFormSubmit = (data: EventFormData) => {
    onSubmit(data);
  };

  const categories = ['Educational', 'Entertainment', 'Special Event', 'Feeding Show', 'Guided Tour'];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Event Title"
            placeholder="Enter event title"
            error={errors.title?.message}
            {...register('title', { required: 'Event title is required' })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Event Category
          </label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter event description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            label="Event Date"
            type="date"
            error={errors.eventDate?.message}
            {...register('eventDate', { required: 'Event date is required' })}
          />
        </div>

        <div>
          <Input
            label="Start Time"
            type="time"
            error={errors.startTime?.message}
            {...register('startTime', { required: 'Start time is required' })}
          />
        </div>

        <div>
          <Input
            label="End Time"
            type="time"
            error={errors.endTime?.message}
            {...register('endTime', { required: 'End time is required' })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Location"
            placeholder="Enter event location"
            error={errors.location?.message}
            {...register('location', { required: 'Location is required' })}
          />
        </div>

        <div>
          <Input
            label="Capacity"
            type="number"
            placeholder="Enter maximum capacity"
            error={errors.capacity?.message}
            {...register('capacity', { 
              required: 'Capacity is required',
              min: { value: 1, message: 'Capacity must be at least 1' }
            })}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {event ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
};
