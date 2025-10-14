import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment, animalId } = req.body;
    const userId = req.user!.id;

    // Check if user already reviewed this animal
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        animalId,
      },
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this animal' });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        animalId,
        status: 'PENDING',
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Error creating review' });
  }
};

export const getReviewsByAnimal = async (req: Request, res: Response) => {
  try {
    const { animalId } = req.params;
    const { status } = req.query;

    const where: any = { animalId };

    if (status) {
      where.status = status;
    } else {
      // Show both approved and pending reviews for now
      where.status = { in: ['APPROVED', 'PENDING'] };
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
};

export const getAllReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { status, sentiment } = req.query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (sentiment) {
      where.sentiment = sentiment;
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        users: {
          select: { id: true, name: true, email: true },
        },
        animals: {
          select: { id: true, name: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json(reviews);
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
};

export const updateReviewStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const review = await prisma.review.update({
      where: { id },
      data: { status },
    });

    res.json(review);
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({ error: 'Error updating review status' });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check if user owns the review or is admin
    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.userId !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this review' });
    }

    await prisma.review.delete({ where: { id } });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Error deleting review' });
  }
};

export const updateReviewSentiment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { sentiment, sentimentScore, toxicity } = req.body;

    const review = await prisma.review.update({
      where: { id },
      data: {
        sentiment,
        sentimentScore,
        toxicity,
      },
    });

    res.json(review);
  } catch (error) {
    console.error('Update review sentiment error:', error);
    res.status(500).json({ error: 'Error updating review sentiment' });
  }
};


