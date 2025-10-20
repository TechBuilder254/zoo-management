import React, { useState, useEffect } from 'react';
import { animalService } from '../services/animalService';
import { Animal } from '../types';
import { AnimalGrid } from '../components/animals/AnimalGrid';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import toast from 'react-hot-toast';

export const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await animalService.getFavorites();
      setFavorites(data);
    } catch (error) {
      toast.error('Failed to load favorites');
      console.error('Favorites error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    await loadFavorites();
  };

  if (!loading && favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
        <Card padding="lg" className="text-center max-w-md">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Favorites Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding animals to your favorites to see them here!
          </p>
          <Button variant="primary" onClick={() => window.location.href = '/animals'} fullWidth>
            Explore Animals
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Favorite Animals
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Animals you've saved for later viewing
          </p>
        </div>

        <AnimalGrid
          animals={favorites}
          loading={loading}
          onFavoriteToggle={handleFavoriteToggle}
        />
      </div>
    </div>
  );
};






