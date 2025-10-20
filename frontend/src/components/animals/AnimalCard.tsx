import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star } from 'lucide-react';
import { Animal } from '../../types';
import { Card } from '../common/Card';
import { useAuth } from '../../hooks/useAuth';
import { animalService } from '../../services/animalService';
import { saveScrollPosition } from '../common/ScrollToTop';
import { ProgressiveImage } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

interface AnimalCardProps {
  animal: Animal;
  onFavoriteToggle?: () => void;
}

export const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onFavoriteToggle }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [favoriteLoading, setFavoriteLoading] = React.useState(false);

  // Check if animal is favorited when component mounts
  React.useEffect(() => {
    if (isAuthenticated) {
      checkFavoriteStatus();
    }
  }, [isAuthenticated, animal.id, animal._id]);

  const checkFavoriteStatus = async () => {
    if (!isAuthenticated) return;
    
    try {
      const favorites = await animalService.getFavorites();
      const animalId = animal.id || animal._id;
      const isFavorited = favorites.some(fav => (fav.id || fav._id) === animalId);
      setIsFavorite(isFavorited);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return;
    }

    if (favoriteLoading) return;

    setFavoriteLoading(true);
    try {
      const animalId = animal.id || animal._id!;
      if (isFavorite) {
        await animalService.removeFromFavorites(animalId);
        toast.success('Removed from favorites');
      } else {
        await animalService.addToFavorites(animalId);
        toast.success('Added to favorites');
      }
      setIsFavorite(!isFavorite);
      onFavoriteToggle?.();
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const getConservationColor = (status: string): string => {
    switch (status) {
      case 'Endangered':
        return 'bg-red-100 text-red-800';
      case 'Vulnerable':
        return 'bg-orange-100 text-orange-800';
      case 'Near Threatened':
        return 'bg-yellow-100 text-yellow-800';
      case 'Least Concern':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCardClick = () => {
    // Save current scroll position before navigating to animal detail
    saveScrollPosition(window.location.pathname + window.location.search);
  };

  return (
    <Link to={`/animals/${animal.id || animal._id}`} onClick={handleCardClick}>
      <Card hover padding="none" className="overflow-hidden group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <ProgressiveImage
            src={animal.image_url || animal.imageUrl || animal.mainPhoto || animal.photos?.[0] || 'https://via.placeholder.com/400x300?text=Animal'}
            alt={animal.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            placeholder="https://via.placeholder.com/400x300?text=Loading..."
          />
          
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            disabled={favoriteLoading}
            className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={20}
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}
            />
          </button>

          {/* Conservation Status Badge */}
          {animal.conservationStatus && (
            <div className="absolute top-3 left-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConservationColor(animal.conservationStatus)}`}>
                {animal.conservationStatus}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
            {animal.name}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 italic">
            {animal.species}
          </p>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
            {animal.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
              <MapPin size={16} />
              <span>{typeof animal.habitat === 'string' ? animal.habitat : animal.habitat?.name}</span>
            </div>
            
            {(animal.averageRating || animal._count?.reviews) && (
              <div className="flex items-center space-x-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="text-gray-900 dark:text-white font-medium">
                  {animal.averageRating?.toFixed(1) || '0.0'}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  ({animal._count?.reviews || animal.reviewCount || 0})
                </span>
              </div>
            )}
          </div>

          {/* Animal Type */}
          <div className="mt-3">
            <span className="inline-block px-3 py-1 bg-primary-light text-primary text-xs font-medium rounded-full">
              {animal.category || animal.type}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};






