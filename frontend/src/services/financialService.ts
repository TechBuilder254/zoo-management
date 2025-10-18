import { supabase } from '../config/supabase';

export interface FinancialData {
  period: string;
  year: number;
  dateRange: {
    start: string;
    end: string;
  };
  financial: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    avgBookingValue: number;
    avgDailyRevenue: number;
  };
  revenue: {
    byTicketType: Array<{
      ticket_type: string;
      _sum: { total_price: number };
      _count: { id: number };
    }>;
    monthly: Array<{
      month: string;
      revenue: number;
      year: number;
    }>;
    totalDiscounts: number;
  };
  expenses: {
    total: number;
    breakdown: {
      animalCare: number;
      staffSalaries: number;
      maintenance: number;
      utilities: number;
      marketing: number;
      insurance: number;
      other: number;
    };
  };
  bookings: {
    total: number;
    byStatus: Array<{
      status: string;
      _count: { id: number };
    }>;
    stats: {
      avgValue: number;
      dailyAvg: number;
    };
  };
  performance: {
    topAnimals: Array<{
      id: string;
      name: string;
      species: string;
      image_url: string;
      _count: {
        favorites: number;
        reviews: number;
      };
    }>;
    visitorDemographics: Array<{
      role: string;
      _count: { id: number };
    }>;
    promoUsage: number;
  };
  trends: {
    revenueGrowth: number;
    bookingGrowth: number;
  };
}

export interface FinancialSummary {
  monthlyRevenue: number;
  yearlyRevenue: number;
  monthlyBookings: number;
  avgBookingValue: number;
  currency: string;
}

export const financialService = {
  async getFinancialData(period: string = 'monthly', year: number = new Date().getFullYear()): Promise<FinancialData> {
    try {
      // Get bookings data for the specified period
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', 'CONFIRMED');

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        throw bookingsError;
      }

      // Calculate financial metrics
      const totalRevenue = bookings?.reduce((sum: number, booking: any) => sum + (booking.total_price || 0), 0) || 0;
      const totalExpenses = totalRevenue * 0.3; // Mock 30% expenses
      const netProfit = totalRevenue - totalExpenses;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
      const avgBookingValue = bookings?.length ? totalRevenue / bookings.length : 0;
      const avgDailyRevenue = totalRevenue / 30; // Mock daily average

      // Get revenue by ticket type
      const revenueByTicketType = bookings?.reduce((acc: any, booking: any) => {
        const ticketType = booking.ticket_type || 'adult';
        if (!acc[ticketType]) {
          acc[ticketType] = { total_price: 0, count: 0 };
        }
        acc[ticketType].total_price += booking.total_price || 0;
        acc[ticketType].count += 1;
        return acc;
      }, {} as any) || {};

      const revenueByTicketTypeArray = Object.entries(revenueByTicketType).map(([ticket_type, data]: [string, any]) => ({
        ticket_type,
        _sum: { total_price: data.total_price },
        _count: { id: data.count }
      }));

      // Mock monthly revenue data
      const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(year, i).toLocaleString('default', { month: 'long' }),
        revenue: Math.random() * 10000,
        year
      }));

      // Get top animals
      const { data: topAnimals } = await supabase
        .from('animals')
        .select(`
          id,
          name,
          species,
          image_url,
          user_favorites (id),
          reviews (id)
        `)
        .limit(5);

      const topAnimalsFormatted = topAnimals?.map((animal: any) => ({
        id: animal.id,
        name: animal.name,
        species: animal.species,
        image_url: animal.image_url || '',
        _count: {
          favorites: animal.user_favorites?.length || 0,
          reviews: animal.reviews?.length || 0
        }
      })) || [];

      return {
        period,
        year,
        dateRange: {
          start: new Date(year, 0, 1).toISOString(),
          end: new Date(year, 11, 31).toISOString()
        },
        financial: {
          totalRevenue,
          totalExpenses,
          netProfit,
          profitMargin,
          avgBookingValue,
          avgDailyRevenue
        },
        revenue: {
          byTicketType: revenueByTicketTypeArray,
          monthly: monthlyRevenue,
          totalDiscounts: 0
        },
        expenses: {
          total: totalExpenses,
          breakdown: {
            animalCare: totalExpenses * 0.3,
            staffSalaries: totalExpenses * 0.25,
            maintenance: totalExpenses * 0.15,
            utilities: totalExpenses * 0.1,
            marketing: totalExpenses * 0.1,
            insurance: totalExpenses * 0.05,
            other: totalExpenses * 0.05,
          }
        },
        bookings: {
          total: bookings?.length || 0,
          byStatus: [
            { status: 'CONFIRMED', _count: { id: bookings?.filter((b: any) => b.status === 'CONFIRMED').length || 0 } },
            { status: 'PENDING', _count: { id: bookings?.filter((b: any) => b.status === 'PENDING').length || 0 } },
            { status: 'CANCELLED', _count: { id: bookings?.filter((b: any) => b.status === 'CANCELLED').length || 0 } }
          ],
          stats: {
            avgValue: avgBookingValue,
            dailyAvg: avgDailyRevenue
          }
        },
        performance: {
          topAnimals: topAnimalsFormatted,
          visitorDemographics: [],
          promoUsage: 0
        },
        trends: {
          revenueGrowth: 0,
          bookingGrowth: 0
        }
      };
    } catch (error) {
      console.error('Error in financialService.getFinancialData:', error);
      throw error;
    }
  },

  async getFinancialSummary(): Promise<FinancialSummary> {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', 'CONFIRMED');

      if (error) {
        console.error('Error fetching bookings for summary:', error);
        throw error;
      }

      const monthlyRevenue = bookings?.reduce((sum: number, booking: any) => sum + (booking.total_price || 0), 0) || 0;
      const yearlyRevenue = monthlyRevenue * 12; // Mock yearly calculation
      const monthlyBookings = bookings?.length || 0;
      const avgBookingValue = monthlyBookings ? monthlyRevenue / monthlyBookings : 0;

      return {
        monthlyRevenue,
        yearlyRevenue,
        monthlyBookings,
        avgBookingValue,
        currency: 'KSh'
      };
    } catch (error) {
      console.error('Error in financialService.getFinancialSummary:', error);
      throw error;
    }
  },

  async exportReport(period: string = 'monthly', year: number = new Date().getFullYear()): Promise<Blob> {
    try {
      // For now, return a mock CSV blob
      const csvContent = `Period,Year,Revenue,Bookings
${period},${year},0,0`;
      
      return new Blob([csvContent], { type: 'text/csv' });
    } catch (error) {
      console.error('Error in financialService.exportReport:', error);
      throw error;
    }
  }
};


