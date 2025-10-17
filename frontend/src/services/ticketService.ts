import api from './api';

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
    const response = await api.get('/tickets');
    
    // Handle Redis-wrapped response format
    if (response.data && response.data.value) {
      try {
        const parsedData = JSON.parse(response.data.value);
        return Array.isArray(parsedData) ? parsedData : [];
      } catch (error) {
        console.error('Error parsing ticket data:', error);
        return [];
      }
    }
    
    // Handle direct array response
    return Array.isArray(response.data) ? response.data : [];
  },

  // Get ticket price by type
  getByType: async (type: string): Promise<TicketPrice> => {
    const response = await api.get(`/tickets/${type}`);
    return response.data;
  },

  // Create ticket price (Admin only)
  create: async (data: CreateTicketPriceData): Promise<TicketPrice> => {
    const response = await api.post('/tickets', data);
    return response.data;
  },

  // Update ticket price (Admin only)
  update: async (type: string, data: UpdateTicketPriceData): Promise<TicketPrice> => {
    const response = await api.put(`/tickets/${type}`, data);
    return response.data;
  },

  // Delete ticket price (Admin only)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tickets/${id}`);
  },
};
