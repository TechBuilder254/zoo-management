import React from 'react';
import { useForm } from 'react-hook-form';
import { Animal } from '../../types/animal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface AnimalFormData {
  name: string;
  species: string;
  category: string;
  habitat: string;
  description: string;
  imageUrl: string;
  diet: string;
  lifespan: string;
  status: string;
}

interface AnimalFormProps {
  animal?: Animal;
  onSubmit: (data: AnimalFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AnimalForm: React.FC<AnimalFormProps> = ({
  animal,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AnimalFormData>({
    defaultValues: animal ? {
      name: animal.name,
      species: animal.species,
      category: animal.category,
      habitat: typeof animal.habitat === 'string' ? animal.habitat : animal.habitat?.name || '',
      description: animal.description,
      imageUrl: animal.imageUrl,
      diet: animal.diet,
      lifespan: animal.lifespan,
      status: animal.status
    } : {
      name: '',
      species: '',
      category: 'Mammals',
      habitat: '',
      description: '',
      imageUrl: '',
      diet: '',
      lifespan: '',
      status: 'ACTIVE'
    }
  });

  const handleFormSubmit = (data: AnimalFormData) => {
    onSubmit(data);
  };

  const categories = ['Mammals', 'Birds', 'Reptiles', 'Amphibians', 'Fish', 'Invertebrates'];
  const statuses = ['ACTIVE', 'INACTIVE', 'QUARANTINE', 'MEDICAL_CARE'];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Animal Name"
            placeholder="Enter animal name"
            error={errors.name?.message}
            {...register('name', { required: 'Animal name is required' })}
          />
        </div>

        <div>
          <Input
            label="Species"
            placeholder="Enter species name"
            error={errors.species?.message}
            {...register('species', { required: 'Species is required' })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            {...register('status', { required: 'Status is required' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.status.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Habitat"
            placeholder="Enter habitat description"
            error={errors.habitat?.message}
            {...register('habitat', { required: 'Habitat is required' })}
          />
        </div>

        <div>
          <Input
            label="Diet"
            placeholder="Enter diet information"
            error={errors.diet?.message}
            {...register('diet', { required: 'Diet is required' })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Lifespan"
            placeholder="Enter lifespan information"
            error={errors.lifespan?.message}
            {...register('lifespan', { required: 'Lifespan is required' })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image
          </label>
          <div className="space-y-3">
            <Input
              label="Image URL"
              placeholder="Enter image URL"
              error={errors.imageUrl?.message}
              {...register('imageUrl', { 
                required: 'Image URL is required',
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Must be a valid URL'
                }
              })}
            />
            <div className="text-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">OR</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Image File
              </label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary-dark
                  file:cursor-pointer
                  cursor-pointer
                  border border-gray-300 dark:border-gray-600 rounded-lg
                  bg-white dark:bg-gray-700"
                onChange={(e) => {
                  // Handle file upload - for now just show a message
                  const file = e.target.files?.[0];
                  if (file) {
                    alert(`File selected: ${file.name}\nNote: File upload functionality will be implemented in the next update. Please use image URL for now.`);
                  }
                }}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </p>
            </div>
          </div>
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
          placeholder="Enter animal description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.description.message}
          </p>
        )}
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
          {animal ? 'Update Animal' : 'Create Animal'}
        </Button>
      </div>
    </form>
  );
};
