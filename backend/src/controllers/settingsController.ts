import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Get or create default settings
    let settings = await prisma.systemSettings.findFirst();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.systemSettings.create({
        data: {
          site_name: 'Wildlife Zoo',
          site_description: 'Experience the wonders of wildlife in our state-of-the-art zoo',
          max_booking_days: 30,
          max_booking_quantity: 10,
          maintenance_mode: false,
          email_notifications: true,
          sms_notifications: false,
          auto_approve_bookings: true,
          currency: 'USD',
          timezone: 'UTC',
          language: 'en'
        }
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Error fetching settings' });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const {
      site_name,
      site_description,
      max_booking_days,
      max_booking_quantity,
      maintenance_mode,
      email_notifications,
      sms_notifications,
      auto_approve_bookings,
      currency,
      timezone,
      language
    } = req.body;

    // Validate required fields
    if (!site_name || !site_description) {
      return res.status(400).json({ error: 'Site name and description are required' });
    }

    if (max_booking_days < 1 || max_booking_days > 365) {
      return res.status(400).json({ error: 'Max booking days must be between 1 and 365' });
    }

    if (max_booking_quantity < 1 || max_booking_quantity > 100) {
      return res.status(400).json({ error: 'Max booking quantity must be between 1 and 100' });
    }

    // Update or create settings
    const settings = await prisma.systemSettings.upsert({
      where: { id: 'default' },
      update: {
        site_name,
        site_description,
        max_booking_days: parseInt(max_booking_days),
        max_booking_quantity: parseInt(max_booking_quantity),
        maintenance_mode: Boolean(maintenance_mode),
        email_notifications: Boolean(email_notifications),
        sms_notifications: Boolean(sms_notifications),
        auto_approve_bookings: Boolean(auto_approve_bookings),
        currency,
        timezone,
        language,
        updated_at: new Date()
      },
      create: {
        id: 'default',
        site_name,
        site_description,
        max_booking_days: parseInt(max_booking_days),
        max_booking_quantity: parseInt(max_booking_quantity),
        maintenance_mode: Boolean(maintenance_mode),
        email_notifications: Boolean(email_notifications),
        sms_notifications: Boolean(sms_notifications),
        auto_approve_bookings: Boolean(auto_approve_bookings),
        currency,
        timezone,
        language
      }
    });

    res.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Error updating settings' });
  }
};

export const resetSettings = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const defaultSettings = await prisma.systemSettings.upsert({
      where: { id: 'default' },
      update: {
        site_name: 'Wildlife Zoo',
        site_description: 'Experience the wonders of wildlife in our state-of-the-art zoo',
        max_booking_days: 30,
        max_booking_quantity: 10,
        maintenance_mode: false,
        email_notifications: true,
        sms_notifications: false,
        auto_approve_bookings: true,
        currency: 'USD',
        timezone: 'UTC',
        language: 'en',
        updated_at: new Date()
      },
      create: {
        id: 'default',
        site_name: 'Wildlife Zoo',
        site_description: 'Experience the wonders of wildlife in our state-of-the-art zoo',
        max_booking_days: 30,
        max_booking_quantity: 10,
        maintenance_mode: false,
        email_notifications: true,
        sms_notifications: false,
        auto_approve_bookings: true,
        currency: 'USD',
        timezone: 'UTC',
        language: 'en'
      }
    });

    res.json(defaultSettings);
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({ error: 'Error resetting settings' });
  }
};

export const clearAllData = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Clear all data in the correct order (respecting foreign key constraints)
    await prisma.$transaction(async (tx: any) => {
      // Delete in reverse dependency order
      await tx.favorite.deleteMany();
      await tx.review.deleteMany();
      await tx.booking.deleteMany();
      await tx.promoCode.deleteMany();
      await tx.ticketPrice.deleteMany();
      await tx.animal.deleteMany();
      await tx.event.deleteMany();
      await tx.staff.deleteMany();
      await tx.user.deleteMany({
        where: {
          role: {
            not: 'ADMIN'
          }
        }
      });
    });

    res.json({ message: 'All data cleared successfully' });
  } catch (error) {
    console.error('Clear data error:', error);
    res.status(500).json({ error: 'Error clearing data' });
  }
};

