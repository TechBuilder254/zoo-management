import { supabase } from '../config/supabase';
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
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          users (
            id,
            name,
            email
          ),
          promo_codes (
            id,
            code,
            description,
            discount_type,
            discount_value
          )
        `, { count: 'exact' });

      // Apply status filter
      if (params?.status) {
        query = query.eq('status', params.status);
      }

      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 12;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        bookings: data || [],
        total: count || 0,
        page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      };
    } catch (error) {
      console.error('Error in bookingService.getAll:', error);
        return {
        bookings: [],
        total: 0,
          page: 1,
        totalPages: 0,
          hasNext: false,
          hasPrev: false,
        };
    }
  },

  getById: async (id: string): Promise<Booking> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          users!bookings_user_id_fkey (
            id,
            name,
            email
          ),
          promo_codes!bookings_promo_code_id_fkey (
            id,
            code,
            description,
            discount_type,
            discount_value
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching booking:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in bookingService.getById:', error);
      throw error;
    }
  },

  create: async (data: CreateBookingData): Promise<Booking> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase
        .from('bookings')
        .insert([{
          user_id: user.id,
          visit_date: data.visit_date || data.visitDate,
          ticket_type: data.ticket_type,
          quantity: data.quantity || 1,
          total_price: 0, // Will be calculated
          status: 'PENDING',
          promo_code_id: data.promo_code_id || data.promoCode,
          discount_amount: data.discountAmount || 0
        }])
        .select(`
          *,
          users!bookings_user_id_fkey (
            id,
            name,
            email
          ),
          promo_codes!bookings_promo_code_id_fkey (
            id,
            code,
            description,
            discount_type,
            discount_value
          )
        `)
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Error in bookingService.create:', error);
      throw error;
    }
  },

  processPayment: async (data: PaymentData): Promise<{ booking: Booking; clientSecret: string }> => {
    try {
      // Update booking status to confirmed
      const { data: booking, error } = await supabase
        .from('bookings')
        .update({
          status: 'CONFIRMED',
          payment_id: data.paymentMethodId,
          payment_status: 'COMPLETED'
        })
        .eq('id', data.bookingId)
        .select(`
          *,
          users!bookings_user_id_fkey (
            id,
            name,
            email
          ),
          promo_codes!bookings_promo_code_id_fkey (
            id,
            code,
            description,
            discount_type,
            discount_value
          )
        `)
        .single();

      if (error) {
        console.error('Error processing payment:', error);
        throw error;
      }

      return {
        booking,
        clientSecret: 'mock_client_secret' // Replace with actual Stripe integration
      };
    } catch (error) {
      console.error('Error in bookingService.processPayment:', error);
      throw error;
    }
  },

  cancel: async (id: string): Promise<Booking> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'CANCELLED' })
        .eq('id', id)
        .select(`
          *,
          users!bookings_user_id_fkey (
            id,
            name,
            email
          ),
          promo_codes!bookings_promo_code_id_fkey (
            id,
            code,
            description,
            discount_type,
            discount_value
          )
        `)
        .single();

      if (error) {
        console.error('Error cancelling booking:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in bookingService.cancel:', error);
      throw error;
    }
  },

  getByReference: async (reference: string): Promise<Booking> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          users!bookings_user_id_fkey (
            id,
            name,
            email
          ),
          promo_codes!bookings_promo_code_id_fkey (
            id,
            code,
            description,
            discount_type,
            discount_value
          )
        `)
        .eq('id', reference) // Assuming reference is the booking ID
        .single();

      if (error) {
        console.error('Error fetching booking by reference:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in bookingService.getByReference:', error);
      throw error;
    }
  },

  markAsUsed: async (id: string): Promise<Booking> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'COMPLETED' })
        .eq('id', id)
        .select(`
          *,
          users!bookings_user_id_fkey (
            id,
            name,
            email
          ),
          promo_codes!bookings_promo_code_id_fkey (
            id,
            code,
            description,
            discount_type,
            discount_value
          )
        `)
        .single();

      if (error) {
        console.error('Error marking booking as used:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in bookingService.markAsUsed:', error);
      throw error;
    }
  },

  getUserBookings: async (): Promise<Booking[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          users!bookings_user_id_fkey (
            id,
            name,
            email
          ),
          promo_codes!bookings_promo_code_id_fkey (
            id,
            code,
            description,
            discount_type,
            discount_value
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user bookings:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in bookingService.getUserBookings:', error);
      return [];
    }
  },
};






