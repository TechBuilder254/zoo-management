import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { usePromoCode } from '../controllers/promoController';
import { cacheManager, CacheKeys, invalidateCache } from '../utils/cache';
import { getPaginationParams, buildPaginatedResponse } from '../utils/pagination';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { visitDate, tickets, promoCode, discountAmount } = req.body;
    const userId = req.user!.id;

    // Calculate total price from tickets
    let totalPrice = 0;
    let totalQuantity = 0;
    let ticketType = '';

    // Handle both old format (single ticket) and new format (multiple tickets)
    if (tickets) {
      if (tickets.adult) {
        totalPrice += tickets.adult.price * tickets.adult.quantity;
        totalQuantity += tickets.adult.quantity;
        ticketType += `Adult:${tickets.adult.quantity} `;
      }
      if (tickets.child) {
        totalPrice += tickets.child.price * tickets.child.quantity;
        totalQuantity += tickets.child.quantity;
        ticketType += `Child:${tickets.child.quantity} `;
      }
      if (tickets.senior) {
        totalPrice += tickets.senior.price * tickets.senior.quantity;
        totalQuantity += tickets.senior.quantity;
        ticketType += `Senior:${tickets.senior.quantity} `;
      }
    } else {
      // Fallback for old format
      const { ticketType: oldTicketType, quantity, totalPrice: oldTotalPrice } = req.body;
      totalPrice = oldTotalPrice;
      totalQuantity = quantity;
      ticketType = oldTicketType;
    }

    // Apply discount if promo code is provided
    if (promoCode && discountAmount > 0) {
      totalPrice = Math.max(0, totalPrice - discountAmount);
    }

    const booking = await prisma.booking.create({
      data: {
        visit_date: new Date(visitDate),
        ticket_type: ticketType.trim(),
        quantity: totalQuantity,
        total_price: totalPrice,
        user_id: userId,
        status: 'PENDING',
        promo_code_id: promoCode || null,
        discount_amount: discountAmount || 0,
      },
    });

    // Increment promo code usage if used
    if (promoCode) {
      try {
        await usePromoCode(promoCode);
      } catch (error) {
        console.error('Failed to update promo code usage:', error);
        // Don't fail the booking if promo code update fails
      }
    }

    // Invalidate booking caches
    invalidateCache.bookingsByUser(userId);
    invalidateCache.bookings();

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Error creating booking' });
  }
};

export const getUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Check cache
    const cacheKey = CacheKeys.BOOKINGS_USER(userId);
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const bookings = await prisma.booking.findMany({
      where: { user_id: userId },
      include: {
        promo_codes: {
          select: {
            id: true,
            code: true,
            description: true,
            discount_type: true,
            discount_value: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // Cache for 1 minute
    cacheManager.set(cacheKey, bookings, 60);

    res.json(bookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};

export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const { page, limit, skip } = getPaginationParams(req);

    // Check cache
    const queryParams = JSON.stringify({ status, page, limit });
    const cacheKey = CacheKeys.BOOKINGS_FILTERED(queryParams);
    
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const where: any = {};

    if (status) {
      where.status = status;
    }

    // Execute queries in parallel
    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          users: {
            select: { id: true, name: true, email: true },
          },
          promo_codes: {
            select: {
              id: true,
              code: true,
              description: true,
              discount_type: true,
              discount_value: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.booking.count({ where }),
    ]);

    // Build paginated response
    const response = buildPaginatedResponse(bookings, totalCount, page, limit);

    // Cache for 1 minute
    cacheManager.set(cacheKey, response, 60);

    res.json(response);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        users: {
          select: { id: true, name: true, email: true },
        },
        promo_codes: {
          select: {
            id: true,
            code: true,
            description: true,
            discount_type: true,
            discount_value: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.user_id !== userId && userRole !== 'ADMIN' && userRole !== 'STAFF') {
      return res.status(403).json({ error: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Error fetching booking' });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, paymentId, paymentStatus } = req.body;

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status,
        payment_id: paymentId,
        payment_status: paymentStatus,
      },
    });

    // Invalidate booking caches
    invalidateCache.bookingsByUser(booking.user_id);
    invalidateCache.bookings();

    res.json(booking);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Error updating booking' });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.user_id !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    // Invalidate booking caches
    invalidateCache.bookingsByUser(booking.user_id);
    invalidateCache.bookings();

    res.json(updatedBooking);
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Error cancelling booking' });
  }
};


