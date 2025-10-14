import api from './api';
import { Booking } from '../types';

export interface CreateBookingData {
  visitDate: string;
  tickets: {
    adult: { quantity: number; price: number };
    child: { quantity: number; price: number };
    senior: { quantity: number; price: number };
  };
  promoCode?: string;
  discountAmount?: number;
}

export interface PaymentData {
  bookingId: string;
  paymentMethodId: string;
}

export const bookingService = {
  getAll: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings/admin/all');
    return response.data;
  },

  getById: async (id: string): Promise<Booking> => {
    // Mock booking retrieval since no backend is running
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would fetch from localStorage or a mock database
        // For now, we'll create a mock booking with the provided ID
        const mockBooking: Booking = {
          id: id,
          _id: id,
          bookingReference: `ZOO-2025-${Math.floor(Math.random() * 10000)}`,
          userId: 'user_123',
          user: {
            id: 'user_123',
            name: 'John Doe',
            email: 'john@example.com'
          },
          visitDate: new Date().toISOString(),
          tickets: {
            adult: { quantity: 2, price: 1500 },
            child: { quantity: 1, price: 750 },
            senior: { quantity: 0, price: 1000 }
          },
          totalAmount: 3750,
          totalPrice: 3250, // With discount applied
          ticketType: 'mixed',
          quantity: 3,
          status: 'confirmed',
          paymentStatus: 'completed',
          paymentId: `pi_${Date.now()}`,
          qrCode: `qr_${Date.now()}`,
          ticketUsed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        resolve(mockBooking);
      }, 500);
    });
  },

  create: async (data: CreateBookingData): Promise<Booking> => {
    // Mock booking creation since no backend is running
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockBooking: Booking = {
          id: `booking_${Date.now()}`,
          _id: `booking_${Date.now()}`,
          bookingReference: `ZOO-2025-${Math.floor(Math.random() * 10000)}`,
          userId: 'user_123',
          user: {
            id: 'user_123',
            name: 'John Doe',
            email: 'john@example.com'
          },
          visitDate: data.visitDate,
          tickets: data.tickets,
          totalAmount: data.tickets.adult.quantity * data.tickets.adult.price + 
                      data.tickets.child.quantity * data.tickets.child.price + 
                      data.tickets.senior.quantity * data.tickets.senior.price,
          totalPrice: data.tickets.adult.quantity * data.tickets.adult.price + 
                     data.tickets.child.quantity * data.tickets.child.price + 
                     data.tickets.senior.quantity * data.tickets.senior.price - (data.discountAmount || 0),
          ticketType: 'mixed',
          quantity: data.tickets.adult.quantity + data.tickets.child.quantity + data.tickets.senior.quantity,
          status: 'confirmed',
          paymentStatus: 'completed',
          paymentId: `pi_${Date.now()}`,
          qrCode: `qr_${Date.now()}`,
          ticketUsed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        resolve(mockBooking);
      }, 1000);
    });
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
    // Mock user bookings since no backend is running
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUserBookings: Booking[] = [
          {
            id: 'booking_1',
            _id: 'booking_1',
            bookingReference: 'ZOO-2025-1234',
            userId: 'user_123',
            user: {
              id: 'user_123',
              name: 'John Doe',
              email: 'john@example.com'
            },
            visitDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
            tickets: {
              adult: { quantity: 2, price: 1500 },
              child: { quantity: 1, price: 750 },
              senior: { quantity: 0, price: 1000 }
            },
            totalAmount: 3750,
            totalPrice: 3250, // With discount
            ticketType: 'mixed',
            quantity: 3,
            status: 'upcoming',
            paymentStatus: 'completed',
            paymentId: `pi_${Date.now()}`,
            qrCode: `qr_${Date.now()}`,
            ticketUsed: false,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'booking_2',
            _id: 'booking_2',
            bookingReference: 'ZOO-2025-5678',
            userId: 'user_123',
            user: {
              id: 'user_123',
              name: 'John Doe',
              email: 'john@example.com'
            },
            visitDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
            tickets: {
              adult: { quantity: 1, price: 1500 },
              child: { quantity: 2, price: 750 },
              senior: { quantity: 1, price: 1000 }
            },
            totalAmount: 4000,
            totalPrice: 3600, // With discount
            ticketType: 'mixed',
            quantity: 4,
            status: 'upcoming',
            paymentStatus: 'completed',
            paymentId: `pi_${Date.now() + 1}`,
            qrCode: `qr_${Date.now() + 1}`,
            ticketUsed: false,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'booking_3',
            _id: 'booking_3',
            bookingReference: 'ZOO-2025-9999',
            userId: 'user_123',
            user: {
              id: 'user_123',
              name: 'John Doe',
              email: 'john@example.com'
            },
            visitDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month ago
            tickets: {
              adult: { quantity: 1, price: 1500 },
              child: { quantity: 0, price: 750 },
              senior: { quantity: 0, price: 1000 }
            },
            totalAmount: 1500,
            totalPrice: 1500,
            ticketType: 'adult',
            quantity: 1,
            status: 'completed',
            paymentStatus: 'completed',
            paymentId: `pi_${Date.now() + 2}`,
            qrCode: `qr_${Date.now() + 2}`,
            ticketUsed: true,
            createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 days ago
            updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        resolve(mockUserBookings);
      }, 500);
    });
  },
};




