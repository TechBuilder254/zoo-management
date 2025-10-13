import api from './api';
import { Animal, AnimalFormData, AnimalType, ConservationStatus } from '../types';
import { mockAnimals, searchAnimals } from '../data/mockAnimals';

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
    // Use mock data instead of API call for demonstration
    let filteredAnimals = [...mockAnimals];

    // Apply filters
    if (filters?.search) {
      filteredAnimals = searchAnimals(filters.search);
    }

    if (filters?.type) {
      filteredAnimals = filteredAnimals.filter(animal => animal.type === filters.type);
    }

    if (filters?.conservationStatus) {
      filteredAnimals = filteredAnimals.filter(animal => animal.conservationStatus === filters.conservationStatus);
    }

    // Apply sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'name':
          filteredAnimals.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'age':
          filteredAnimals.sort((a, b) => b.age - a.age);
          break;
        case 'popularity':
          filteredAnimals.sort((a, b) => b.averageRating - a.averageRating);
          break;
      }
    }

    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAnimals = filteredAnimals.slice(startIndex, endIndex);

    return {
      animals: paginatedAnimals,
      total: filteredAnimals.length,
      page: page,
      totalPages: Math.ceil(filteredAnimals.length / limit)
    };
  },

  getById: async (id: string): Promise<Animal> => {
    // Use mock data instead of API call for demonstration
    const animal = mockAnimals.find(a => a._id === id);
    if (!animal) {
      throw new Error('Animal not found');
    }
    return animal;
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
    // Use mock data instead of API call for demonstration
    return searchAnimals(query);
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




