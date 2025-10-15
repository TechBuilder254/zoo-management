import { Request, Response } from 'express';
import prisma from '../config/database';

// Subscribe to newsletter
export const subscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'Valid email is required' });
      return;
    }

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (existing) {
      if (existing.is_active) {
        res.status(200).json({ message: 'Already subscribed to newsletter' });
        return;
      }
      // Reactivate subscription
      await prisma.newsletter.update({
        where: { email },
        data: { is_active: true }
      });
      res.status(200).json({ message: 'Successfully subscribed to newsletter!' });
      return;
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: { email }
    });

    res.status(201).json({ message: 'Successfully subscribed to newsletter!' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe to newsletter' });
  }
};

// Unsubscribe from newsletter
export const unsubscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const subscription = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (!subscription) {
      res.status(404).json({ error: 'Email not found in our newsletter' });
      return;
    }

    await prisma.newsletter.update({
      where: { email },
      data: { is_active: false }
    });

    res.status(200).json({ message: 'Successfully unsubscribed from newsletter' });
  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    res.status(500).json({ error: 'Failed to unsubscribe from newsletter' });
  }
};

// Get all newsletter subscribers (Admin only)
export const getAllSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const subscribers = await prisma.newsletter.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'desc' }
    });

    res.json(subscribers);
  } catch (error) {
    console.error('Get newsletter subscribers error:', error);
    res.status(500).json({ error: 'Failed to fetch newsletter subscribers' });
  }
};


