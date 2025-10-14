import React, { useEffect, useState } from 'react';
import { animalService } from '../services/animalService';
import { Animal } from '../types';

export const TestAPI: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [error, setError] = useState<string>('');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    const testAPI = async () => {
      try {
        setApiUrl(process.env.REACT_APP_API_URL || 'http://localhost:5000/api');
        console.log('Testing API connection...');
        const response = await animalService.getAll();
        console.log('API Response:', response);
        setAnimals(response.animals);
      } catch (err: any) {
        console.error('API Error:', err);
        setError(err.message || 'Failed to connect to backend');
      }
    };

    testAPI();
  }, []);

  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">API Connection Test</h1>
      
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <p className="font-semibold text-gray-900 dark:text-white">API URL: {apiUrl}</p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded mb-4">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {animals.length > 0 ? (
        <div className="space-y-4">
          <p className="text-green-600 font-semibold">✅ Connected to Backend! Found {animals.length} animals:</p>
          {animals.map((animal) => (
            <div key={animal.id} className="p-4 border border-gray-300 dark:border-gray-700 rounded">
              <p className="font-bold text-gray-900 dark:text-white">{animal.name}</p>
              <p className="text-gray-600 dark:text-gray-400">{animal.species}</p>
              <p className="text-sm text-gray-500">Category: {animal.category}</p>
              <p className="text-sm text-gray-500">ID: {animal.id}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      )}
    </div>
  );
};

export default TestAPI;

