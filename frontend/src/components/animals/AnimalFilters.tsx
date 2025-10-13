import React from 'react';
import { Filter } from 'lucide-react';
import { AnimalType, ConservationStatus } from '../../types';
import { ANIMAL_TYPES, CONSERVATION_STATUSES } from '../../utils/constants';

interface AnimalFiltersProps {
  selectedType?: AnimalType;
  selectedStatus?: ConservationStatus;
  sortBy?: 'name' | 'age' | 'popularity';
  onTypeChange: (type?: AnimalType) => void;
  onStatusChange: (status?: ConservationStatus) => void;
  onSortChange: (sort: 'name' | 'age' | 'popularity') => void;
  onReset: () => void;
}

export const AnimalFilters: React.FC<AnimalFiltersProps> = ({
  selectedType,
  selectedStatus,
  sortBy = 'name',
  onTypeChange,
  onStatusChange,
  onSortChange,
  onReset,
}) => {
  const hasActiveFilters = selectedType || selectedStatus || sortBy !== 'name';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filters
          </h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-primary hover:text-primary-dark transition-colors"
          >
            Reset All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Animal Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Animal Type
          </label>
          <select
            value={selectedType || ''}
            onChange={(e) => onTypeChange(e.target.value as AnimalType || undefined)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-900 dark:text-white"
          >
            <option value="">All Types</option>
            {ANIMAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Conservation Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Conservation Status
          </label>
          <select
            value={selectedStatus || ''}
            onChange={(e) => onStatusChange(e.target.value as ConservationStatus || undefined)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-900 dark:text-white"
          >
            <option value="">All Statuses</option>
            {CONSERVATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'name' | 'age' | 'popularity')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-900 dark:text-white"
          >
            <option value="name">Name (A-Z)</option>
            <option value="age">Age</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
      </div>
    </div>
  );
};




