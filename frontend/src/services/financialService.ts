import api from './api';

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
    const response = await api.get(`/financial/data?period=${period}&year=${year}`);
    return response.data;
  },

  async getFinancialSummary(): Promise<FinancialSummary> {
    const response = await api.get('/financial/summary');
    return response.data;
  },

  async exportReport(period: string = 'monthly', year: number = new Date().getFullYear()): Promise<Blob> {
    const response = await api.get(`/financial/data?period=${period}&year=${year}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

