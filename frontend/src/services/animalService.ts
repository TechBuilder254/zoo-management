import api from './api';
import { Animal, AnimalFormData, AnimalType, ConservationStatus } from '../types';
import { PaginatedResponse } from '../types/pagination';

export interface AnimalFilters {
  search?: string;
  type?: AnimalType;
  conservationStatus?: ConservationStatus;
  sortBy?: 'name' | 'age' | 'popularity';
  page?: number;
  limit?: number;
}

export interface AnimalsResponse {
  animals: Animal[];
  total: number;
  page: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export const animalService = {
  getAll: async (filters?: AnimalFilters): Promise<AnimalsResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.type) params.append('category', filters.type);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<any>(`/animals?${params.toString()}`);
    console.log('Animals API Response:', response.data);
    
    let responseData: PaginatedResponse<Animal>;
    
    // Handle Redis-wrapped response format
    if (response.data && typeof response.data === 'object' && 'value' in response.data) {
      try {
        const parsedData = JSON.parse(response.data.value);
        responseData = parsedData;
        console.log('Parsed animals data from Redis wrapper:', responseData);
      } catch (error) {
        console.error('Error parsing animals data:', error);
        return {
          animals: [],
          total: 0,
          page: 1,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        };
      }
    } else {
      responseData = response.data;
      console.log('Direct animals data:', responseData);
    }
    
    // Backend now returns paginated response
    return {
      animals: responseData.data,
      total: responseData.pagination.totalItems,
      page: responseData.pagination.currentPage,
      totalPages: responseData.pagination.totalPages,
      hasNext: responseData.pagination.hasNext,
      hasPrev: responseData.pagination.hasPrev,
    };
  },

  getById: async (id: string): Promise<Animal> => {
    const response = await api.get<any>(`/animals/${id}`);
    
    // Handle Redis-wrapped response format
    if (response.data && typeof response.data === 'object' && 'value' in response.data) {
      try {
        const parsedData = JSON.parse(response.data.value);
        return parsedData;
      } catch (error) {
        console.error('Error parsing animal data:', error);
        throw new Error('Failed to parse animal data');
      }
    }
    
    return response.data;
  },

  create: async (data: AnimalFormData, _photos?: File[]): Promise<Animal> => {
    // For now, send as JSON instead of FormData since we're not handling file uploads yet
    // The _photos parameter is prefixed with _ to indicate it's intentionally unused
    const response = await api.post<Animal>('/animals', data);
    return response.data;
  },

  update: async (id: string, data: Partial<AnimalFormData>): Promise<Animal> => {
    const response = await api.put<Animal>(`/animals/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/animals/${id}`);
  },

  search: async (query: string): Promise<Animal[]> => {
    const response = await api.get<PaginatedResponse<Animal>>(`/animals?search=${query}`);
    return response.data.data;
  },

  addToFavorites: async (animalId: string): Promise<void> => {
    await api.post(`/animals/${animalId}/favorite`);
  },

  removeFromFavorites: async (animalId: string): Promise<void> => {
    await api.post(`/animals/${animalId}/favorite`);
  },

  getFavorites: async (): Promise<Animal[]> => {
    const response = await api.get<Animal[]>('/animals/user/favorites');
    return response.data;
  },
};






