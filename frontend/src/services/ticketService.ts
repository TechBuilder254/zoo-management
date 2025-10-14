import api from './api';

export interface TicketPrice {
  id: string;
  ticketType: string;
  price: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketPriceData {
  ticketType: string;
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
    return response.data;
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
