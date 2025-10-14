import React, { useEffect, useState } from 'react';
import { animalService } from '../services/animalService';
import { eventService } from '../services/eventService';
import { ticketService } from '../services/ticketService';
import { Animal } from '../types';
import api from '../services/api';

interface TestResult {
  name: string;
  status: 'loading' | 'success' | 'error';
  message: string;
  data?: any;
}

export const TestAPI: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [error, setError] = useState<string>('');
  const [apiUrl, setApiUrl] = useState('');
  const [tests, setTests] = useState<TestResult[]>([]);

  const updateTest = (name: string, status: TestResult['status'], message: string, data?: any) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        return prev.map(t => t.name === name ? { name, status, message, data } : t);
      }
      return [...prev, { name, status, message, data }];
    });
  };

  useEffect(() => {
    const runAllTests = async () => {
      setApiUrl(process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

      // Test 1: Direct Health Check
      updateTest('Health Check', 'loading', 'Testing...');
      try {
        const response = await fetch('http://localhost:5000/health');
        const data = await response.json();
        updateTest('Health Check', 'success', `Backend is running: ${data.message}`, data);
      } catch (err: any) {
        updateTest('Health Check', 'error', err.message);
      }

      // Test 2: Animals API
      updateTest('Animals API', 'loading', 'Fetching animals...');
      try {
        const response = await animalService.getAll();
        setAnimals(response.animals);
        updateTest('Animals API', 'success', `Found ${response.animals.length} animals`, response.animals.slice(0, 3));
      } catch (err: any) {
        updateTest('Animals API', 'error', err.message);
        setError(err.message || 'Failed to connect to backend');
      }

      // Test 3: Events API
      updateTest('Events API', 'loading', 'Fetching events...');
      try {
        const events = await eventService.getAll();
        updateTest('Events API', 'success', `Found ${events.length} events`, events.slice(0, 2));
      } catch (err: any) {
        updateTest('Events API', 'error', err.message);
      }

      // Test 4: Tickets API
      updateTest('Tickets API', 'loading', 'Fetching ticket prices...');
      try {
        const tickets = await ticketService.getAll();
        updateTest('Tickets API', 'success', `Found ${tickets.length} ticket types`, tickets);
      } catch (err: any) {
        updateTest('Tickets API', 'error', err.message);
      }

      // Test 5: Direct API call
      updateTest('Direct API Call', 'loading', 'Testing direct axios call...');
      try {
        const response = await api.get('/animals');
        updateTest('Direct API Call', 'success', `Got ${response.data.length} animals directly`, response.data.slice(0, 2));
      } catch (err: any) {
        updateTest('Direct API Call', 'error', err.response?.data?.message || err.message);
      }
    };

    runAllTests();
  }, []);

  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">API Connection Test</h1>
      
      <div className="mb-8 p-4 bg-blue-100 dark:bg-blue-900 rounded">
        <p className="font-semibold text-blue-900 dark:text-blue-100">API URL: {apiUrl}</p>
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
          Backend: http://localhost:5000
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Supabase: {process.env.REACT_APP_SUPABASE_URL || 'Not configured'}
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Test Results:</h2>
      
      <div className="space-y-4 mb-8">
        {tests.map((test) => (
          <div
            key={test.name}
            className={`p-4 rounded border-2 ${
              test.status === 'success'
                ? 'bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-700'
                : test.status === 'error'
                ? 'bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-700'
                : 'bg-gray-50 border-gray-300 dark:bg-gray-800 dark:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{test.name}</h3>
              <span className={`text-2xl ${
                test.status === 'success' ? 'text-green-600' : test.status === 'error' ? 'text-red-600' : 'text-gray-400'
              }`}>
                {test.status === 'success' ? '✅' : test.status === 'error' ? '❌' : '⏳'}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">{test.message}</p>
            {test.data && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View Data
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto max-h-60">
                  {JSON.stringify(test.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded mb-6">
          <p className="font-semibold">Critical Error:</p>
          <p>{error}</p>
        </div>
      )}

      {animals.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Sample Animals ({animals.length} total):
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {animals.slice(0, 6).map((animal) => (
              <div key={animal.id} className="p-4 border border-gray-300 dark:border-gray-700 rounded hover:shadow-lg transition">
                <p className="font-bold text-gray-900 dark:text-white">{animal.name}</p>
                <p className="text-gray-600 dark:text-gray-400">{animal.species}</p>
                <p className="text-sm text-gray-500 mt-2">Category: {animal.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestAPI;

