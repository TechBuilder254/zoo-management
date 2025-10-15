import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { cacheManager, CacheKeys, invalidateCache } from '../utils/cache';
import { getPaginationParams, buildPaginatedResponse } from '../utils/pagination';

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
        user_id: userId,
        animal_id: animalId,
      },
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this animal' });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        user_id: userId,
        animal_id: animalId,
        status: 'PENDING',
      },
      include: {
        users: {
          select: { id: true, name: true },
        },
      },
    });

    // Invalidate review and animal caches
    invalidateCache.reviewsByAnimal(animalId);

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

    // Check cache
    const cacheKey = CacheKeys.REVIEWS_BY_ANIMAL(animalId);
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData && !status) {
      return res.json(cachedData);
    }

    const where: any = { animal_id: animalId };

    if (status) {
      where.status = status;
    } else {
      // Show both approved and pending reviews for now
      where.status = { in: ['APPROVED', 'PENDING'] };
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        users: {
          select: { id: true, name: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // Cache for 3 minutes if no status filter
    if (!status) {
      cacheManager.set(cacheKey, reviews, 180);
    }

    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
};

export const getAllReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { status, sentiment } = req.query;
    const { page, limit, skip } = getPaginationParams(req);

    // Check cache
    const queryParams = JSON.stringify({ status, sentiment, page, limit });
    const cacheKey = CacheKeys.REVIEWS_FILTERED(queryParams);
    
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (sentiment) {
      where.sentiment = sentiment;
    }

    // Execute queries in parallel
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        include: {
          users: {
            select: { id: true, name: true, email: true },
          },
          animals: {
            select: { id: true, name: true },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.review.count({ where }),
    ]);

    // Build paginated response
    const response = buildPaginatedResponse(reviews, totalCount, page, limit);

    // Cache for 3 minutes
    cacheManager.set(cacheKey, response, 180);

    res.json(response);
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

    // Invalidate review caches
    invalidateCache.reviews();
    if (review.animal_id) {
      invalidateCache.reviewsByAnimal(review.animal_id);
    }

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

    if (review.user_id !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this review' });
    }

    await prisma.review.delete({ where: { id } });

    // Invalidate review caches
    if (review.animal_id) {
      invalidateCache.reviewsByAnimal(review.animal_id);
    }

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
        sentiment_score: sentimentScore,
        toxicity,
      },
    });

    // Invalidate review caches
    invalidateCache.reviews();

    res.json(review);
  } catch (error) {
    console.error('Update review sentiment error:', error);
    res.status(500).json({ error: 'Error updating review sentiment' });
  }
};


