import { Request, Response } from 'express';
import prisma from '../config/database';

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get total animals
    const totalAnimals = await prisma.animal.count();

    // Get total bookings
    const totalBookings = await prisma.booking.count();

    // Get total revenue from bookings
    const revenueResult = await prisma.booking.aggregate({
      _sum: {
        total_price: true,
      },
    });
    const totalRevenue = revenueResult._sum.total_price || 0;

    // Get total visitors (unique users who have bookings)
    const totalVisitors = await prisma.user.count({
      where: {
        bookings: {
          some: {},
        },
      },
    });

    // Get recent bookings (last 5)
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        users: {
          select: { name: true },
        },
      },
    });

    // Get popular animals (by review count)
    const popularAnimals = await prisma.animal.findMany({
      take: 5,
      orderBy: {
        reviews: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        name: true,
        species: true,
        image_url: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    res.json({
      totalAnimals,
      totalBookings,
      totalRevenue,
      totalVisitors,
      recentBookings,
      popularAnimals,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Error fetching dashboard statistics' });
  }
};
