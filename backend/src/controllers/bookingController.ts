import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { usePromoCode } from '../controllers/promoController';

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
        visitDate: new Date(visitDate),
        ticketType: ticketType.trim(),
        quantity: totalQuantity,
        totalPrice,
        userId,
        status: 'PENDING',
        promoCodeId: promoCode || null,
        discountAmount: discountAmount || 0,
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

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Error creating booking' });
  }
};

export const getUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        promoCode: {
          select: {
            id: true,
            code: true,
            description: true,
            discountType: true,
            discountValue: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(bookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};

export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
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
    });

    res.json(bookings);
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
        user: {
          select: { id: true, name: true, email: true },
        },
        promoCode: {
          select: {
            id: true,
            code: true,
            description: true,
            discountType: true,
            discountValue: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.userId !== userId && userRole !== 'ADMIN' && userRole !== 'STAFF') {
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
        paymentId,
        paymentStatus,
      },
    });

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
    if (booking.userId !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Error cancelling booking' });
  }
};


