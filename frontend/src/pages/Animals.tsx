import React, { useState, useCallback } from 'react';
import { Grid, List as ListIcon, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimalType, ConservationStatus } from '../types';
import { AnimalGrid } from '../components/animals/AnimalGrid';
import { SearchBar } from '../components/animals/SearchBar';
import { AnimalFilters } from '../components/animals/AnimalFilters';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAnimals } from '../hooks/useAnimals';

type ViewMode = 'grid' | 'list';

export const Animals: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<AnimalType | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<ConservationStatus | undefined>();
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'popularity'>('name');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

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

        {/* Search Bar and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} initialValue={search} />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              onClick={() => setViewMode('grid')}
              size="md"
            >
              <Grid size={18} className="mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              onClick={() => setViewMode('list')}
              size="md"
            >
              <ListIcon size={18} className="mr-2" />
              List
            </Button>
          </div>
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

          {/* Animals Display */}
          <div className="lg:col-span-3">
            {!loading && animals.length > 0 && (
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {animals.length} of {total} animals
                </span>
              </div>
            )}
            
            {viewMode === 'grid' ? (
              <AnimalGrid animals={animals} loading={loading} />
            ) : (
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Card key={i} padding="none">
                        <div className="animate-pulse flex">
                          <div className="bg-gray-300 dark:bg-gray-700 h-40 w-48"></div>
                          <div className="flex-1 p-6 space-y-3">
                            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : animals.length === 0 ? (
                  <Card padding="lg" className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">No animals found</p>
                  </Card>
                ) : (
                  animals.map((animal) => (
                    <Card key={animal._id} padding="none" hover className="overflow-hidden">
                      <Link to={`/animals/${animal._id}`} className="flex flex-col sm:flex-row">
                        <img
                          src={animal.mainPhoto}
                          alt={animal.name}
                          className="w-full sm:w-48 h-48 sm:h-40 object-cover"
                        />
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {animal.name}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 italic">
                                {animal.species}
                              </p>
                            </div>
                            <span className="inline-block px-3 py-1 bg-primary-light dark:bg-primary/20 text-primary text-sm font-medium rounded-full">
                              {animal.type}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                            {animal.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span>Age: {animal.age} years</span>
                              <span>•</span>
                              <span><MapPin size={14} className="inline mr-1" />{animal.habitat.name}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              View Details →
                            </Button>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  ))
                )}
              </div>
            )}

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




