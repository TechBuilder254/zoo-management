import api from './api';
import { Animal, AnimalFormData, AnimalType, ConservationStatus } from '../types';

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
}

export const animalService = {
  getAll: async (filters?: AnimalFilters): Promise<AnimalsResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.type) params.append('category', filters.type);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<Animal[]>(`/animals?${params.toString()}`);
    const animals = response.data;
    
    return {
      animals,
      total: animals.length,
      page: filters?.page || 1,
      totalPages: Math.ceil(animals.length / (filters?.limit || 12))
    };
  },

  getById: async (id: string): Promise<Animal> => {
    const response = await api.get<Animal>(`/animals/${id}`);
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
    const response = await api.get<Animal[]>(`/animals?search=${query}`);
    return response.data;
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




