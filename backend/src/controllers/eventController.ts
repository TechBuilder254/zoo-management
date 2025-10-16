import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { cacheManager, CacheKeys, invalidateCache } from '../utils/cache';
import { getPaginationParams, buildPaginatedResponse } from '../utils/pagination';

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    // Check cache
    const cacheKey = status ? `events:status:${status}` : CacheKeys.EVENTS_ALL;
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const where: any = {};

    if (status) {
      where.status = status;
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { start_date: 'asc' },
    });

    // Cache for 10 minutes
    cacheManager.set(cacheKey, events, 600);

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check cache
    const cacheKey = CacheKeys.EVENT_BY_ID(id);
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Cache for 10 minutes
    cacheManager.set(cacheKey, event, 600);

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Error fetching event' });
  }
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const eventData = req.body;
    console.log('Received event data:', eventData);

    const event = await prisma.event.create({
      data: {
        title: eventData.title,
        description: eventData.description,
        start_date: new Date(eventData.startDate || eventData.start_date),
        end_date: new Date(eventData.endDate || eventData.end_date),
        location: eventData.location,
        image_url: eventData.imageUrl || eventData.image_url || null,
        capacity: eventData.capacity,
        price: eventData.price,
        status: eventData.status || 'UPCOMING'
      },
    });

    console.log('Created event:', event);

    // Invalidate event caches
    invalidateCache.events();

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

    const updateData: any = {};
    
    if (eventData.title !== undefined) updateData.title = eventData.title;
    if (eventData.description !== undefined) updateData.description = eventData.description;
    if (eventData.startDate || eventData.start_date) {
      updateData.start_date = new Date(eventData.startDate || eventData.start_date);
    }
    if (eventData.endDate || eventData.end_date) {
      updateData.end_date = new Date(eventData.endDate || eventData.end_date);
    }
    if (eventData.location !== undefined) updateData.location = eventData.location;
    if (eventData.imageUrl !== undefined || eventData.image_url !== undefined) {
      updateData.image_url = eventData.imageUrl || eventData.image_url;
    }
    if (eventData.capacity !== undefined) updateData.capacity = eventData.capacity;
    if (eventData.price !== undefined) updateData.price = eventData.price;
    if (eventData.status !== undefined) {
      // Validate EventStatus values
      const validStatuses = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];
      if (validStatuses.includes(eventData.status)) {
        updateData.status = eventData.status;
      }
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
    });

    // Invalidate event caches
    invalidateCache.eventById(id);

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

    // Invalidate event caches
    invalidateCache.eventById(id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Error deleting event' });
  }
};

