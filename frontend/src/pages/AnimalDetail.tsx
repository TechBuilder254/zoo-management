import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Scale, Info, ArrowLeft, Share2 } from 'lucide-react';
import { useAnimal } from '../hooks/useAnimals';
import { useAuth } from '../hooks/useAuth';
import { reviewService } from '../services/reviewService';
import { Review } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import { FavoriteButton } from '../components/animals/FavoriteButton';
import { RatingStars } from '../components/reviews/RatingStars';
import { ReviewList } from '../components/reviews/ReviewList';
import { ReviewForm } from '../components/reviews/ReviewForm';
import toast from 'react-hot-toast';

export const AnimalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { animal, loading, error } = useAnimal(id!);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      loadReviews();
    }
  }, [id]);

  const loadReviews = async () => {
    if (!id) return;
    
    setReviewsLoading(true);
    try {
      const data = await reviewService.getByAnimalId(id);
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmit = async (data: any) => {
    try {
      await reviewService.create(data);
      toast.success('Review submitted successfully!');
      await loadReviews();
    } catch (error) {
      toast.error('Failed to submit review');
      throw error;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: animal?.name,
        text: `Check out ${animal?.name} at Wildlife Zoo!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading animal details..." />;
  }

  if (error || !animal) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card padding="lg" className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            Animal not found
          </p>
          <Button onClick={() => navigate('/animals')}>
            <ArrowLeft size={18} className="mr-2" />
            Back to Animals
          </Button>
        </Card>
      </div>
    );
  }

  const images = animal.photos.length > 0 ? animal.photos : [animal.mainPhoto];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/animals')}
          className="mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Animals
        </Button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Images */}
          <div>
            <Card padding="none" className="overflow-hidden">
              <img
                src={images[selectedImageIndex]}
                alt={animal.name}
                className="w-full h-96 object-cover"
              />
            </Card>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${animal.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {animal.name}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 italic">
                  {animal.species}
                </p>
              </div>
              <Button variant="ghost" onClick={handleShare}>
                <Share2 size={20} />
              </Button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <RatingStars rating={animal.averageRating} size={24} />
              <span className="text-gray-600 dark:text-gray-400">
                ({animal.reviewCount} reviews)
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-light dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Info size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{animal.type}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-light dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Calendar size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Age</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{animal.age} years</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-light dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Scale size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Weight</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{animal.weight} kg</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-light dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Habitat</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{animal.habitat.name}</p>
                </div>
              </div>
            </div>

            <FavoriteButton isFavorite={false} onClick={() => {}} disabled={!isAuthenticated} />
          </div>
        </div>

        {/* Description & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About {animal.name}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{animal.description}</p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                History
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{animal.history}</p>
            </Card>

            {/* Reviews Section */}
            <Card padding="lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Reviews
              </h2>
              <ReviewList reviews={reviews} loading={reviewsLoading} />
            </Card>

            {/* Review Form */}
            {isAuthenticated && (
              <ReviewForm animalId={animal._id} onSubmit={handleReviewSubmit} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card padding="lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Conservation Status
              </h3>
              <span className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full font-medium">
                {animal.conservationStatus}
              </span>
            </Card>

            <Card padding="lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Diet
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{animal.diet}</p>
            </Card>

            {animal.interestingFacts.length > 0 && (
              <Card padding="lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Interesting Facts
                </h3>
                <ul className="space-y-2">
                  {animal.interestingFacts.map((fact, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{fact}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};




