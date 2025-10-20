import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Animal } from '../../types/animal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { supabase } from '../../config/supabase';

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
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
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

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Try to upload to Supabase storage first
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `animals/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('animal-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        
        // If storage upload fails, convert to base64 for immediate use
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target?.result as string;
          setUploadedImageUrl(base64String);
          setValue('imageUrl', base64String);
          // Clear the URL input field when file is uploaded
          const urlInput = document.querySelector('input[name="imageUrl"]') as HTMLInputElement;
          if (urlInput) urlInput.value = '';
          alert('Image converted to base64 format. Storage upload failed, but image is ready for use.');
        };
        reader.readAsDataURL(file);
        return;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('animal-images')
        .getPublicUrl(filePath);

      setUploadedImageUrl(data.publicUrl);
      setValue('imageUrl', data.publicUrl);
      // Clear the URL input field when file is uploaded
      const urlInput = document.querySelector('input[name="imageUrl"]') as HTMLInputElement;
      if (urlInput) urlInput.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload image. Please try again or use image URL instead.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      handleFileUpload(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    // If user types in URL field, clear the uploaded image
    if (url && uploadedImageUrl) {
      setUploadedImageUrl('');
    }
  };

  const handleFormSubmit = (data: AnimalFormData) => {
    // Use uploaded image URL if available, otherwise use the URL from the form
    const finalData = {
      ...data,
      imageUrl: uploadedImageUrl || data.imageUrl
    };
    onSubmit(finalData);
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
              label={`Image URL ${uploadedImageUrl ? '(disabled - file uploaded)' : ''}`}
              placeholder="Enter image URL"
              error={errors.imageUrl?.message}
              disabled={!!uploadedImageUrl}
              {...register('imageUrl', { 
                required: !uploadedImageUrl ? 'Image URL is required' : false,
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Must be a valid URL'
                }
              })}
              onChange={(e) => {
                // Call the register's onChange first
                register('imageUrl').onChange(e);
                // Then handle our custom logic
                handleUrlChange(e);
              }}
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
                disabled={isUploading}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary-dark
                  file:cursor-pointer
                  cursor-pointer
                  border border-gray-300 dark:border-gray-600 rounded-lg
                  bg-white dark:bg-gray-700
                  disabled:opacity-50 disabled:cursor-not-allowed"
                onChange={handleFileChange}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </p>
              {isUploading && (
                <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                  Uploading image...
                </p>
              )}
              {uploadedImageUrl && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ✓ Image uploaded successfully! (This will replace any URL entered above)
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedImageUrl('');
                        setValue('imageUrl', '');
                        // Clear the file input
                        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                      className="text-xs text-red-600 hover:text-red-800 underline"
                    >
                      Clear
                    </button>
                  </div>
                  <img 
                    src={uploadedImageUrl} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
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
          isLoading={isLoading || isUploading}
          disabled={isUploading}
        >
          {animal ? 'Update Animal' : 'Create Animal'}
        </Button>
      </div>
    </form>
  );
};
