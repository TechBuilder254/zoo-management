import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Info, ArrowLeft, Utensils } from 'lucide-react';
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
import { SocialShare } from '../components/common/SocialShare';
import { ImageLightbox } from '../components/common/ImageLightbox';
import toast from 'react-hot-toast';

export const AnimalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { animal, loading, error } = useAnimal(id!);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (animal) {
      loadReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animal]);

  const loadReviews = async () => {
    const animalId = animal?.id || animal?._id || id;
    if (!animalId) return;
    
    setReviewsLoading(true);
    try {
      console.log('AnimalDetail: Loading reviews for animal ID:', animalId);
      const data = await reviewService.getByAnimalId(animalId);
      console.log('AnimalDetail: Fetched reviews:', data);
      setReviews(data);
    } catch (error) {
      console.error('AnimalDetail: Failed to load reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmit = async (data: any) => {
    try {
      console.log('Submitting review with data:', data);
      const result = await reviewService.create(data);
      console.log('Review submission result:', result);
      toast.success('Review submitted successfully!');
      await loadReviews();
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error('Failed to submit review');
      throw error;
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

  const images = animal.photos && animal.photos.length > 0 
    ? animal.photos 
    : animal.imageUrl 
    ? [animal.imageUrl] 
    : animal.mainPhoto 
    ? [animal.mainPhoto] 
    : ['https://via.placeholder.com/800x600?text=Animal'];

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
            <Card padding="none" className="overflow-hidden cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
              <img
                src={images[selectedImageIndex]}
                alt={animal.name}
                className="w-full h-96 object-cover hover:opacity-90 transition-opacity"
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
            <div className="mb-4">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {animal.name}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 italic mb-4">
                {animal.species}
              </p>
              <SocialShare
                title={`Check out ${animal.name} at Wildlife Zoo!`}
              />
            </div>

            <div className="flex items-center space-x-4 mb-6">
              {(() => {
                const averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;
                console.log('AnimalDetail: Reviews for rating calculation:', reviews);
                console.log('AnimalDetail: Average rating:', averageRating);
                return (
                  <>
                    <RatingStars rating={averageRating} size={24} />
                    <span className="text-gray-600 dark:text-gray-400">
                      ({reviews.length} reviews)
                    </span>
                  </>
                );
              })()}
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-light dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Info size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{animal.category || animal.type}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-light dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Calendar size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Lifespan</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{animal.lifespan}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-light dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Utensils size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Diet</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{animal.diet}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-light dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Habitat</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{typeof animal.habitat === 'string' ? animal.habitat : animal.habitat?.name}</p>
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
            {isAuthenticated && animal && (
              <ReviewForm animalId={animal.id || animal._id || id!} onSubmit={handleReviewSubmit} />
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

            {animal.interestingFacts && animal.interestingFacts.length > 0 && (
              <Card padding="lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Interesting Facts
                </h3>
                <ul className="space-y-2">
                  {animal.interestingFacts?.map((fact, index) => (
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

      {/* Image Lightbox */}
      <ImageLightbox
        images={images}
        currentIndex={selectedImageIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNext={() => setSelectedImageIndex((prev) => (prev + 1) % (images?.length || 1))}
        onPrevious={() => setSelectedImageIndex((prev) => (prev - 1 + (images?.length || 1)) % (images?.length || 1))}
        title={animal.name}
      />
    </div>
  );
};




