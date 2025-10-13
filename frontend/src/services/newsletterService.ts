import api from './api';

export interface NewsletterSubscription {
  email: string;
}

export const newsletterService = {
  subscribe: async (email: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/newsletter/subscribe', { email });
    return response.data;
  },

  unsubscribe: async (email: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/newsletter/unsubscribe', { email });
    return response.data;
  },
};

