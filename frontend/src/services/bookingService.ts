import api from './api';
import { Booking, CreateBookingData } from '../types/booking';
import { PaginationParams } from '../types/pagination';

export interface PaymentData {
  bookingId: string;
  paymentMethodId: string;
}

export interface BookingsResponse {
  bookings: Booking[];
  total: number;
  page: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export const bookingService = {
  getAll: async (params?: PaginationParams & { status?: string }): Promise<BookingsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);

    try {
      const response = await api.get<any>(`/bookings/admin/all?${queryParams.toString()}`);
      console.log('Bookings API Response:', response.data);
      
      // Handle paginated response
      if (response.data.data && response.data.pagination) {
        return {
          bookings: response.data.data,
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
          bookings: response.data,
          total: response.data.length,
          page: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        };
      }
      
      throw new Error('Unexpected response format');
    } catch (error) {
      console.error('Bookings fetch error:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Booking> => {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  create: async (data: CreateBookingData): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  },

  processPayment: async (data: PaymentData): Promise<{ booking: Booking; clientSecret: string }> => {
    const response = await api.post<{ booking: Booking; clientSecret: string }>('/bookings/payment', data);
    return response.data;
  },

  cancel: async (id: string): Promise<Booking> => {
    const response = await api.patch<Booking>(`/bookings/${id}/cancel`);
    return response.data;
  },

  getByReference: async (reference: string): Promise<Booking> => {
    const response = await api.get<Booking>(`/bookings/reference/${reference}`);
    return response.data;
  },

  markAsUsed: async (id: string): Promise<Booking> => {
    const response = await api.put<Booking>(`/bookings/${id}/use`);
    return response.data;
  },

  getUserBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings/user/my-bookings');
    return response.data;
  },
};






