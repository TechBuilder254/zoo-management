import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { start_date: 'asc' },
    });

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Error fetching event' });
  }
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const eventData = req.body;

    const event = await prisma.event.create({
      data: {
        ...eventData,
        startDate: new Date(eventData.startDate),
        endDate: new Date(eventData.endDate),
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Error creating event' });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const eventData = req.body;

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...eventData,
        startDate: eventData.startDate ? new Date(eventData.startDate) : undefined,
        endDate: eventData.endDate ? new Date(eventData.endDate) : undefined,
      },
    });

    res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Error updating event' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: { id },
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Error deleting event' });
  }
};

