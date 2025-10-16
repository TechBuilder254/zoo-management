import { Request, Response } from 'express';
import prisma from '../config/database';

// Get comprehensive financial data
export const getFinancialData = async (req: Request, res: Response) => {
  try {
    const { period = 'monthly', year = new Date().getFullYear() } = req.query;

    // Date range calculation
    const startDate = new Date();
    const endDate = new Date();
    
    if (period === 'monthly') {
      startDate.setFullYear(year, 0, 1); // Start of year
      endDate.setFullYear(year, 11, 31); // End of year
    } else if (period === 'weekly') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'daily') {
      startDate.setDate(startDate.getDate() - 1);
    }

    // 1. Revenue Calculations
    const totalRevenueResult = await prisma.booking.aggregate({
      where: {
        created_at: {
          gte: startDate,
          lte: endDate
        },
        payment_status: 'COMPLETED'
      },
      _sum: {
        total_price: true,
      },
    });
    const totalRevenue = totalRevenueResult._sum.total_price || 0;

    // Revenue by ticket type
    const revenueByTicketType = await prisma.booking.groupBy({
      by: ['ticket_type'],
      where: {
        created_at: {
          gte: startDate,
          lte: endDate
        },
        payment_status: 'COMPLETED'
      },
      _sum: {
        total_price: true,
      },
      _count: {
        id: true,
      },
    });

    // Revenue by month (for charts)
    const monthlyRevenue = [];
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      
      const monthRevenue = await prisma.booking.aggregate({
        where: {
          created_at: {
            gte: monthStart,
            lte: monthEnd
          },
          payment_status: 'COMPLETED'
        },
        _sum: {
          total_price: true,
        },
      });
      
      monthlyRevenue.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        revenue: monthRevenue._sum.total_price || 0,
        year: year
      });
    }

    // 2. Expense Calculations (estimated based on operations)
    const totalBookings = await prisma.booking.count({
      where: {
        created_at: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    // Estimated expenses (this would come from actual expense records in a real system)
    const estimatedExpenses = {
      animalCare: totalBookings * 150, // 150 KSh per booking for animal care
      staffSalaries: 250000, // Monthly staff salaries
      maintenance: totalBookings * 50, // 50 KSh per booking for maintenance
      utilities: 80000, // Monthly utilities
      marketing: totalBookings * 25, // 25 KSh per booking for marketing
      insurance: 15000, // Monthly insurance
      other: 30000 // Other operational costs
    };

    const totalExpenses = Object.values(estimatedExpenses).reduce((sum, expense) => sum + expense, 0);

    // 3. Profit Calculations
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // 4. Booking Statistics
    const bookingStats = await prisma.booking.groupBy({
      by: ['status'],
      where: {
        created_at: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        id: true,
      },
    });

    // 5. Average metrics
    const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
    const avgDailyRevenue = period === 'monthly' ? totalRevenue / 30 : totalRevenue / 1;

    // 6. Promo code usage and savings
    const promoUsage = await prisma.booking.groupBy({
      by: ['promo_code_id'],
      where: {
        created_at: {
          gte: startDate,
          lte: endDate
        },
        promo_code_id: {
          not: null
        }
      },
      _sum: {
        discount_amount: true,
      },
      _count: {
        id: true,
      },
    });

    const totalDiscounts = promoUsage.reduce((sum, promo) => sum + (promo._sum.discount_amount || 0), 0);

    // 7. Top performing animals (by bookings)
    const animalPerformance = await prisma.animal.findMany({
      select: {
        id: true,
        name: true,
        species: true,
        image_url: true,
        _count: {
          select: {
            favorites: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        favorites: {
          _count: 'desc'
        }
      },
      take: 5
    });

    // 8. Visitor demographics
    const visitorStats = await prisma.user.groupBy({
      by: ['role'],
      where: {
        bookings: {
          some: {
            created_at: {
              gte: startDate,
              lte: endDate
            }
          }
        }
      },
      _count: {
        id: true,
      },
    });

    res.json({
      period,
      year,
      dateRange: {
        start: startDate,
        end: endDate
      },
      
      // Financial Summary
      financial: {
        totalRevenue,
        totalExpenses,
        netProfit,
        profitMargin,
        avgBookingValue,
        avgDailyRevenue
      },

      // Revenue Breakdown
      revenue: {
        byTicketType: revenueByTicketType,
        monthly: monthlyRevenue,
        totalDiscounts
      },

      // Expense Breakdown
      expenses: {
        total: totalExpenses,
        breakdown: estimatedExpenses
      },

      // Booking Statistics
      bookings: {
        total: totalBookings,
        byStatus: bookingStats,
        stats: {
          avgValue: avgBookingValue,
          dailyAvg: avgDailyRevenue
        }
      },

      // Performance Metrics
      performance: {
        topAnimals: animalPerformance,
        visitorDemographics: visitorStats,
        promoUsage: promoUsage.length
      },

      // Trends (simplified)
      trends: {
        revenueGrowth: monthlyRevenue.length > 1 ? 
          ((monthlyRevenue[monthlyRevenue.length - 1].revenue - monthlyRevenue[0].revenue) / monthlyRevenue[0].revenue) * 100 : 0,
        bookingGrowth: 0 // Would need historical data for real calculation
      }
    });

  } catch (error) {
    console.error('Get financial data error:', error);
    res.status(500).json({ error: 'Error fetching financial data' });
  }
};

// Get financial summary for dashboard
export const getFinancialSummary = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // This month's revenue
    const monthlyRevenue = await prisma.booking.aggregate({
      where: {
        created_at: {
          gte: startOfMonth
        },
        payment_status: 'COMPLETED'
      },
      _sum: {
        total_price: true,
      },
    });

    // This year's revenue
    const yearlyRevenue = await prisma.booking.aggregate({
      where: {
        created_at: {
          gte: startOfYear
        },
        payment_status: 'COMPLETED'
      },
      _sum: {
        total_price: true,
      },
    });

    // Total bookings this month
    const monthlyBookings = await prisma.booking.count({
      where: {
        created_at: {
          gte: startOfMonth
        }
      }
    });

    // Average booking value
    const avgBookingValue = monthlyBookings > 0 ? 
      (monthlyRevenue._sum.total_price || 0) / monthlyBookings : 0;

    res.json({
      monthlyRevenue: monthlyRevenue._sum.total_price || 0,
      yearlyRevenue: yearlyRevenue._sum.total_price || 0,
      monthlyBookings,
      avgBookingValue,
      currency: 'KES'
    });

  } catch (error) {
    console.error('Get financial summary error:', error);
    res.status(500).json({ error: 'Error fetching financial summary' });
  }
};

