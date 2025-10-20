import React, { useState, useCallback } from 'react';
import { Grid, List as ListIcon, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimalType, ConservationStatus } from '../types';
import { AnimalGrid } from '../components/animals/AnimalGrid';
import { SearchBar } from '../components/animals/SearchBar';
import { AnimalFilters } from '../components/animals/AnimalFilters';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Container } from '../components/common/Container';
import { useAnimals } from '../hooks/useAnimalsQuery';

type ViewMode = 'grid' | 'list';

export const Animals: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<AnimalType | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<ConservationStatus | undefined>();
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'popularity'>('name');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('list'); // Default to list view

  const { data: animalsData, isLoading: loading } = useAnimals({
    search,
    type: selectedType,
    conservationStatus: selectedStatus,
    sortBy,
    page,
    limit: 12,
  });

  const animals = (animalsData as any)?.animals || [];
  const total = (animalsData as any)?.total || 0;
  const totalPages = (animalsData as any)?.totalPages || 0;

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
      <Container>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Our Animals
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Explore our diverse collection of wildlife from around the world
          </p>
        </div>

        {/* Search Bar and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} initialValue={search} />
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="List view"
            >
              <ListIcon size={18} />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Grid view"
            >
              <Grid size={18} />
              <span className="hidden sm:inline">Grid</span>
            </button>
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
                  animals.map((animal: any) => (
                    <Card key={animal.id || animal._id} padding="none" hover className="overflow-hidden">
                      <Link to={`/animals/${animal.id || animal._id}`} className="flex flex-col sm:flex-row">
                        <img
                          src={animal.image_url || animal.imageUrl || animal.mainPhoto || 'https://via.placeholder.com/400x300?text=Animal'}
                          alt={animal.name}
                          className="w-full sm:w-40 h-32 sm:h-32 object-cover"
                        />
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">
                                {animal.name}
                              </h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                {animal.species}
                              </p>
                            </div>
                            <span className="inline-block px-2 py-0.5 bg-primary-light dark:bg-primary/20 text-primary text-xs font-medium rounded-full">
                              {animal.category || animal.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                            {animal.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
                              {animal.lifespan && <><span>Lifespan: {animal.lifespan}</span><span>•</span></>}
                              <span><MapPin size={12} className="inline mr-1" />{typeof animal.habitat === 'string' ? animal.habitat : animal.habitat?.name}</span>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs">
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
      </Container>
    </div>
  );
};





