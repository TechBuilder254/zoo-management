import api from './api';
import { Booking, BookingFormData } from '../types';

export interface CreateBookingData {
  visitDate: string;
  tickets: {
    adult: { quantity: number; price: number };
    child: { quantity: number; price: number };
    senior: { quantity: number; price: number };
  };
}

export interface PaymentData {
  bookingId: string;
  paymentMethodId: string;
}

export const bookingService = {
  getAll: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
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
    const response = await api.put<Booking>(`/bookings/${id}/cancel`);
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
    const response = await api.get<Booking[]>('/bookings/user/me');
    return response.data;
  },
};




