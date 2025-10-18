import { supabase } from '../config/supabase';
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
    try {
      // Get total animals count
      const { count: totalAnimals } = await supabase
        .from('animals')
        .select('*', { count: 'exact', head: true });

      // Get total bookings count
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Get total revenue
      const { data: revenueData } = await supabase
        .from('bookings')
        .select('total_price')
        .eq('status', 'CONFIRMED');

      const totalRevenue = revenueData?.reduce((sum: number, booking: any) => sum + (booking.total_price || 0), 0) || 0;

      // Get total visitors (unique users who have bookings)
      const { data: visitorsData } = await supabase
        .from('bookings')
        .select('user_id')
        .eq('status', 'CONFIRMED');

      const uniqueVisitors = new Set(visitorsData?.map((b: any) => b.user_id) || []).size;

      // Get recent bookings
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select(`
          *,
          users!bookings_user_id_fkey (
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get popular animals (animals with most reviews)
      const { data: popularAnimals } = await supabase
        .from('animals')
        .select(`
          id,
          name,
          species,
          image_url,
          reviews!reviews_animal_id_fkey (
            id
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Transform popular animals data
      const transformedPopularAnimals = popularAnimals?.map((animal: any) => ({
        id: animal.id,
        name: animal.name,
        species: animal.species,
        imageUrl: animal.image_url || '',
        _count: {
          reviews: animal.reviews?.length || 0
        }
      })) || [];

      return {
        totalAnimals: totalAnimals || 0,
        totalBookings: totalBookings || 0,
        totalRevenue,
        totalVisitors: uniqueVisitors,
        recentBookings: recentBookings || [],
        popularAnimals: transformedPopularAnimals,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalAnimals: 0,
        totalBookings: 0,
        totalRevenue: 0,
        totalVisitors: 0,
        recentBookings: [],
        popularAnimals: [],
      };
    }
  },
};
