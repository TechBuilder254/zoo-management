import { supabase } from '../config/supabase';

export interface TicketPrice {
  id: string;
  ticket_type: string;
  price: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTicketPriceData {
  ticket_type: string;
  price: number;
  description?: string;
}

export interface UpdateTicketPriceData {
  price: number;
  description?: string;
}

export const ticketService = {
  // Get all ticket prices
  getAll: async (): Promise<TicketPrice[]> => {
    try {
      const { data, error } = await supabase
        .from('ticket_prices')
        .select('*')
        .eq('is_active', true)
        .order('ticket_type');

      if (error) {
        console.error('Error fetching ticket prices:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in ticketService.getAll:', error);
      return [];
    }
  },

  // Get ticket price by type
  getByType: async (type: string): Promise<TicketPrice | null> => {
    try {
      const { data, error } = await supabase
        .from('ticket_prices')
        .select('*')
        .eq('ticket_type', type)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching ticket price by type:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in ticketService.getByType:', error);
      return null;
    }
  },

  // Create ticket price (Admin only)
  create: async (data: CreateTicketPriceData): Promise<TicketPrice> => {
    const { data: result, error } = await supabase
      .from('ticket_prices')
      .insert([{
        ticket_type: data.ticket_type,
        price: data.price,
        description: data.description,
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create ticket price: ${error.message}`);
    }

    return result;
  },

  // Update ticket price (Admin only)
  update: async (id: string, data: UpdateTicketPriceData): Promise<TicketPrice> => {
    const { data: result, error } = await supabase
      .from('ticket_prices')
      .update({
        price: data.price,
        description: data.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update ticket price: ${error.message}`);
    }

    return result;
  },

  // Delete ticket price (Admin only)
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('ticket_prices')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete ticket price: ${error.message}`);
    }
  },
};
