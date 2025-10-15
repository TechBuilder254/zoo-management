import api from './api';
import { Review, ReviewFormData, ReviewStatus } from '../types';
import { PaginationParams } from '../types/pagination';

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

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

  getAll: async (params?: PaginationParams & { status?: string; sentiment?: string }): Promise<ReviewsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.sentiment) queryParams.append('sentiment', params.sentiment);

    try {
      const response = await api.get<any>(`/reviews/admin/all?${queryParams.toString()}`);
      console.log('Reviews API Response:', response.data);
      
      // Handle paginated response
      if (response.data.data && response.data.pagination) {
        return {
          reviews: response.data.data,
          total: response.data.pagination.totalItems,
          page: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          hasNext: response.data.pagination.hasNext,
          hasPrev: response.data.pagination.hasPrev,
        };
      }
      
      // Handle non-paginated response (backward compatibility)
      if (Array.isArray(response.data)) {
        return {
          reviews: response.data,
          total: response.data.length,
          page: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        };
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Reviews fetch error:', error);
      throw error;
    }
  },
};






