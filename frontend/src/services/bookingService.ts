import { supabase } from '../config/supabase';
import { Booking, CreateBookingData, UpdateBookingData } from '../types/booking';
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

      // Ensure user exists in custom users table
      const { error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (userError && userError.code === 'PGRST116') {
        // User doesn't exist in custom users table, create them
        console.log('Creating user in custom users table for booking:', user.id);
        const { error: createError } = await supabase
          .from('users')
          .insert([{
            id: user.id,
            email: user.email || '',
            password: 'supabase_auth_user', // Placeholder since Supabase handles auth
            name: user.user_metadata?.name || user.email || 'User',
            role: user.user_metadata?.role || 'VISITOR',
            created_at: user.created_at || new Date().toISOString(),
            updated_at: user.updated_at || new Date().toISOString()
          }]);

        if (createError) {
          console.error('Error creating user for booking:', createError);
          throw new Error(`Failed to create user: ${createError.message}`);
        }
        console.log('User created successfully for booking:', user.id);
      } else if (userError) {
        console.error('Error checking user for booking:', userError);
        throw new Error(`Failed to check user: ${userError.message}`);
      }

      // Calculate total price from tickets
      let totalPrice = 0;
      let totalTickets = 0;
      
      if (data.tickets) {
        totalTickets = data.tickets.adult.quantity + data.tickets.child.quantity + data.tickets.senior.quantity;
        totalPrice = (data.tickets.adult.quantity * data.tickets.adult.price) +
                    (data.tickets.child.quantity * data.tickets.child.price) +
                    (data.tickets.senior.quantity * data.tickets.senior.price);
      } else {
        totalTickets = data.quantity || 1;
        totalPrice = data.total_price || 0;
      }

      // Apply discount if promo code is used
      const discountAmount = data.discountAmount || 0;
      const finalPrice = Math.max(0, totalPrice - discountAmount);

      const { data: result, error } = await supabase
        .from('bookings')
        .insert([{
          user_id: user.id,
          visit_date: data.visit_date || data.visitDate,
          ticket_type: data.ticket_type || 'mixed',
          quantity: totalTickets,
          total_price: finalPrice,
          status: 'CONFIRMED', // Auto-confirm for now
          promo_code_id: data.promo_code_id || data.promoCode,
          discount_amount: discountAmount,
          payment_status: 'COMPLETED',
          payment_id: `PAY-${Date.now()}`
        }])
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
        `)
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        console.error('Booking data:', {
          user_id: user.id,
          visit_date: data.visit_date || data.visitDate,
          ticket_type: data.ticket_type,
          quantity: data.quantity || 1,
          total_price: finalPrice,
          status: 'PENDING',
          promo_code_id: data.promo_code_id || data.promoCode,
          discount_amount: discountAmount
        });
        throw error;
      }

      console.log('Booking created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error in bookingService.create:', error);
      console.error('Full error details:', JSON.stringify(error, null, 2));
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

  update: async (id: string, data: UpdateBookingData): Promise<Booking> => {
    try {
      const { data: result, error } = await supabase
        .from('bookings')
        .update({
          status: data.status,
          payment_status: data.payment_status
        })
        .eq('id', id)
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
        `)
        .single();

      if (error) {
        console.error('Error updating booking:', error);
        throw error;
      }

      return result as unknown as Booking;
    } catch (error) {
      console.error('Error in bookingService.update:', error);
      throw error as any;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting booking:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in bookingService.delete:', error);
      throw error as any;
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






