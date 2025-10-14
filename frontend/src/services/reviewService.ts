import api from './api';
import { Review, ReviewFormData, ReviewStatus } from '../types';

export const reviewService = {
  getByAnimalId: async (animalId: string): Promise<Review[]> => {
    const response = await api.get<Review[]>(`/reviews/animal/${animalId}`);
    return response.data;
  },

  create: async (data: ReviewFormData): Promise<Review> => {
    const response = await api.post<Review>('/reviews', data);
    return response.data;
  },

  update: async (id: string, data: Partial<ReviewFormData>): Promise<Review> => {
    const response = await api.put<Review>(`/reviews/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },

  moderate: async (id: string, status: ReviewStatus): Promise<Review> => {
    const response = await api.patch<Review>(`/reviews/${id}/status`, { status });
    return response.data;
  },

  markAsHelpful: async (id: string): Promise<Review> => {
    const response = await api.post<Review>(`/reviews/${id}/helpful`);
    return response.data;
  },

  getAll: async (): Promise<Review[]> => {
    const response = await api.get<Review[]>('/reviews/admin/all');
    return response.data;
  },
};





