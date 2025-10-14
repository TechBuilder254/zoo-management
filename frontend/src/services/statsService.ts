import api from './api';
import { Booking } from '../types/booking';

export interface DashboardStats {
  totalAnimals: number;
  totalBookings: number;
  totalRevenue: number;
  totalVisitors: number;
  recentBookings: Booking[];
  popularAnimals: Array<{
    id: string;
    name: string;
    species: string;
    imageUrl: string;
    _count: {
      reviews: number;
    };
  }>;
}

export const statsService = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/stats/dashboard');
    return response.data;
  },
};
