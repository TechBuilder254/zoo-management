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
    const response = await api.get<AnimalsResponse>('/animals', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Animal> => {
    const response = await api.get<Animal>(`/animals/${id}`);
    return response.data;
  },

  create: async (data: AnimalFormData, photos: File[]): Promise<Animal> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'interestingFacts' || key === 'habitat') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });
    photos.forEach((photo) => {
      formData.append('photos', photo);
    });
    
    const response = await api.post<Animal>('/animals', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
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
    const response = await api.get<Animal[]>('/animals/search', { params: { q: query } });
    return response.data;
  },

  addToFavorites: async (animalId: string): Promise<void> => {
    await api.post(`/animals/${animalId}/favorite`);
  },

  removeFromFavorites: async (animalId: string): Promise<void> => {
    await api.delete(`/animals/${animalId}/favorite`);
  },

  getFavorites: async (): Promise<Animal[]> => {
    const response = await api.get<Animal[]>('/animals/favorites');
    return response.data;
  },
};




