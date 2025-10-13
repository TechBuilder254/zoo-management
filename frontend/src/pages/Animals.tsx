import React, { useState, useCallback } from 'react';
import { AnimalType, ConservationStatus } from '../types';
import { AnimalGrid } from '../components/animals/AnimalGrid';
import { SearchBar } from '../components/animals/SearchBar';
import { AnimalFilters } from '../components/animals/AnimalFilters';
import { useAnimals } from '../hooks/useAnimals';

export const Animals: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<AnimalType | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<ConservationStatus | undefined>();
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'popularity'>('name');
  const [page, setPage] = useState(1);

  const { animals, loading, total, totalPages } = useAnimals({
    search,
    type: selectedType,
    conservationStatus: selectedStatus,
    sortBy,
    page,
    limit: 12,
  });

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, []);

  const handleTypeChange = useCallback((type?: AnimalType) => {
    setSelectedType(type);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((status?: ConservationStatus) => {
    setSelectedStatus(status);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((sort: 'name' | 'age' | 'popularity') => {
    setSortBy(sort);
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setSearch('');
    setSelectedType(undefined);
    setSelectedStatus(undefined);
    setSortBy('name');
    setPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Animals
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore our diverse collection of wildlife from around the world
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} initialValue={search} />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <AnimalFilters
              selectedType={selectedType}
              selectedStatus={selectedStatus}
              sortBy={sortBy}
              onTypeChange={handleTypeChange}
              onStatusChange={handleStatusChange}
              onSortChange={handleSortChange}
              onReset={handleReset}
            />
          </div>

          {/* Animals Grid */}
          <div className="lg:col-span-3">
            {!loading && animals.length > 0 && (
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Showing {animals.length} of {total} animals
              </div>
            )}
            
            <AnimalGrid animals={animals} loading={loading} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  Page {page} of {totalPages}
                </span>
                
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};




