import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Get all ticket prices
export const getTicketPrices = async (req: Request, res: Response) => {
  try {
    const prices = await prisma.ticketPrice.findMany({
      where: { is_active: true },
      orderBy: { ticket_type: 'asc' }
    });
    res.json(prices);
  } catch (error) {
    console.error('Get ticket prices error:', error);
    res.status(500).json({ error: 'Error fetching ticket prices' });
  }
};

// Get ticket price by type
export const getTicketPriceByType = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const price = await prisma.ticketPrice.findUnique({
      where: { ticket_type: type }
    });
    
    if (!price) {
      return res.status(404).json({ error: 'Ticket type not found' });
    }
    
    res.json(price);
  } catch (error) {
    console.error('Get ticket price error:', error);
    res.status(500).json({ error: 'Error fetching ticket price' });
  }
};

// Update ticket price (Admin only)
export const updateTicketPrice = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { type } = req.params;
    const { price, description } = req.body;

    if (!price || price <= 0) {
      return res.status(400).json({ error: 'Valid price is required' });
    }

    const updatedPrice = await prisma.ticketPrice.upsert({
      where: { ticketType: type },
      update: {
        price,
        description,
        updatedAt: new Date()
      },
      create: {
        ticketType: type,
        price,
        description,
        isActive: true
      }
    });

    res.json(updatedPrice);
  } catch (error) {
    console.error('Update ticket price error:', error);
    res.status(500).json({ error: 'Error updating ticket price' });
  }
};

// Create ticket price (Admin only)
export const createTicketPrice = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { ticketType, price, description } = req.body;

    if (!ticketType || !price || price <= 0) {
      return res.status(400).json({ error: 'Valid ticket type and price are required' });
    }

    const ticketPrice = await prisma.ticketPrice.create({
      data: {
        ticketType,
        price,
        description,
        isActive: true
      }
    });

    res.status(201).json(ticketPrice);
  } catch (error) {
    console.error('Create ticket price error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Ticket type already exists' });
    }
    res.status(500).json({ error: 'Error creating ticket price' });
  }
};

// Delete ticket price (Admin only)
export const deleteTicketPrice = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    await prisma.ticketPrice.delete({
      where: { id }
    });

    res.json({ message: 'Ticket price deleted successfully' });
  } catch (error) {
    console.error('Delete ticket price error:', error);
    res.status(500).json({ error: 'Error deleting ticket price' });
  }
};
