import React from 'react';
import { Animal } from '../../types';
import { AnimalCard } from './AnimalCard';
import { Loader } from '../common/Loader';

interface AnimalGridProps {
  animals: Animal[];
  loading?: boolean;
  onFavoriteToggle?: () => void;
}

export const AnimalGrid: React.FC<AnimalGridProps> = ({
  animals,
  loading = false,
  onFavoriteToggle,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader size="lg" text="Loading animals..." />
      </div>
    );
  }

  if (animals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No Animals Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {animals.map((animal) => (
        <AnimalCard
          key={animal._id}
          animal={animal}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
};




