import React, { useState } from 'react';
import { animalService } from '../services/animalService';
import { authService } from '../services/authService';
import { reviewService } from '../services/reviewService';
import toast from 'react-hot-toast';

export const TestBackend: React.FC = () => {
  const [token, setToken] = useState('');
  const [animalId, setAnimalId] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const testLogin = async () => {
    try {
      const response = await authService.login({
        email: 'visitor@example.com',
        password: 'password123'
      });
      setToken(response.token);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      toast.success('Logged in!');
      setResults(prev => [...prev, { action: 'Login', status: 'Success', data: response.user }]);
    } catch (error: any) {
      toast.error('Login failed: ' + error.message);
      setResults(prev => [...prev, { action: 'Login', status: 'Failed', error: error.message }]);
    }
  };

  const testGetAnimals = async () => {
    try {
      const response = await animalService.getAll();
      setResults(prev => [...prev, { 
        action: 'Get Animals', 
        status: 'Success', 
        data: `Found ${response.animals.length} animals` 
      }]);
      if (response.animals.length > 0) {
        setAnimalId(response.animals[0].id);
      }
      toast.success(`Found ${response.animals.length} animals`);
    } catch (error: any) {
      toast.error('Failed to get animals');
      setResults(prev => [...prev, { action: 'Get Animals', status: 'Failed', error: error.message }]);
    }
  };

  const testCreateReview = async () => {
    if (!animalId) {
      toast.error('Get animals first to get an animalId');
      return;
    }
    if (!token) {
      toast.error('Login first');
      return;
    }

    try {
      const review = await reviewService.create({
        animalId,
        rating: 5,
        comment: 'Test review - This is amazing!'
      });
      toast.success('Review created!');
      setResults(prev => [...prev, { action: 'Create Review', status: 'Success', data: review }]);
    } catch (error: any) {
      toast.error('Failed to create review: ' + error.message);
      setResults(prev => [...prev, { action: 'Create Review', status: 'Failed', error: error.response?.data || error.message }]);
    }
  };

  const testToggleFavorite = async () => {
    if (!animalId) {
      toast.error('Get animals first to get an animalId');
      return;
    }
    if (!token) {
      toast.error('Login first');
      return;
    }

    try {
      await animalService.addToFavorites(animalId);
      toast.success('Favorite toggled!');
      setResults(prev => [...prev, { action: 'Toggle Favorite', status: 'Success' }]);
    } catch (error: any) {
      toast.error('Failed to toggle favorite: ' + error.message);
      setResults(prev => [...prev, { action: 'Toggle Favorite', status: 'Failed', error: error.response?.data || error.message }]);
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Backend API Testing</h1>

      <div className="space-y-4 mb-8">
        <button
          onClick={testLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          1. Test Login (visitor@example.com)
        </button>

        <button
          onClick={testGetAnimals}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-2"
        >
          2. Test Get Animals
        </button>

        <button
          onClick={testCreateReview}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 ml-2"
        >
          3. Test Create Review
        </button>

        <button
          onClick={testToggleFavorite}
          className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 ml-2"
        >
          4. Test Toggle Favorite
        </button>
      </div>

      {token && (
        <div className="p-4 bg-green-100 rounded mb-4">
          <p className="font-semibold text-green-800">✅ Logged in!</p>
          <p className="text-xs text-green-700 break-all">Token: {token.substring(0, 50)}...</p>
        </div>
      )}

      {animalId && (
        <div className="p-4 bg-blue-100 rounded mb-4">
          <p className="font-semibold text-blue-800">Animal ID for testing: {animalId}</p>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Test Results:</h2>
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded ${
              result.status === 'Success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            <p className={`font-semibold ${result.status === 'Success' ? 'text-green-800' : 'text-red-800'}`}>
              {result.action}: {result.status}
            </p>
            {result.data && (
              <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(result.data, null, 2)}</pre>
            )}
            {result.error && (
              <pre className="text-xs mt-2 overflow-auto text-red-600">{JSON.stringify(result.error, null, 2)}</pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestBackend;

