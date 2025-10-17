import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { redisCache, CacheKeys, CacheTTL, invalidateCache } from '../utils/redisCache';
import { getPaginationParams, buildPaginatedResponse } from '../utils/pagination';

export const getAllAnimals = async (req: Request, res: Response) => {
  try {
    const { category, status, search } = req.query;
    const { page, limit, skip } = getPaginationParams(req);

    // Generate cache key based on query params including pagination
    const queryParams = JSON.stringify({ category, status, search, page, limit });
    const cacheKey = CacheKeys.ANIMALS_FILTERED(queryParams);

    // Check Redis cache first
    const cachedData = await redisCache.get(cacheKey);
    if (cachedData) {
      res.set('X-Cache', 'HIT');
      return res.json(cachedData);
    }

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { species: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Execute queries in parallel for better performance
    const [animals, totalCount] = await Promise.all([
      prisma.animal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { reviews: true, favorites: true },
          },
        },
      }),
      prisma.animal.count({ where }),
    ]);

    // Build paginated response
    const response = buildPaginatedResponse(animals, totalCount, page, limit);

    // Cache the result in Redis for 1 hour (animals don't change often)
    await redisCache.set(cacheKey, response, CacheTTL.ANIMALS);
    res.set('X-Cache', 'MISS');

    res.json(response);
  } catch (error) {
    console.error('Get animals error:', error);
    res.status(500).json({ error: 'Error fetching animals' });
  }
};

export const getAnimalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check Redis cache first
    const cacheKey = CacheKeys.ANIMAL_BY_ID(id);
    const cachedData = await redisCache.get(cacheKey);
    if (cachedData) {
      res.set('X-Cache', 'HIT');
      return res.json(cachedData);
    }

    const animal = await prisma.animal.findUnique({
      where: { id },
      include: {
        reviews: {
          where: { status: 'APPROVED' },
          include: {
            users: {
              select: { id: true, name: true },
            },
          },
          orderBy: { created_at: 'desc' },
          take: 10, // Limit to first 10 reviews for faster loading
        },
        _count: {
          select: { favorites: true, reviews: true },
        },
      },
    });

    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }

    // Cache for 30 minutes in Redis
    await redisCache.set(cacheKey, animal, CacheTTL.ANIMAL_DETAILS);
    res.set('X-Cache', 'MISS');

    res.json(animal);
  } catch (error) {
    console.error('Get animal error:', error);
    res.status(500).json({ error: 'Error fetching animal' });
  }
};

export const createAnimal = async (req: AuthRequest, res: Response) => {
  try {
    console.log('Create animal request body:', req.body);
    
    const {
      name,
      species,
      category,
      habitat,
      description,
      imageUrl,
      diet,
      lifespan,
      status = 'ACTIVE'
    } = req.body;

    // Validate required fields
    if (!name || !species || !category || !habitat || !description || !diet || !lifespan) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: req.body
      });
    }

    const animal = await prisma.animal.create({
      data: {
        name,
        species,
        category,
        habitat,
        description,
        imageUrl: imageUrl || '',
        diet,
        lifespan,
        status,
        location: null, // Optional field
      },
    });

    // Invalidate animal caches
    invalidateCache.animals();

    res.status(201).json(animal);
  } catch (error) {
    console.error('Create animal error:', error);
    res.status(500).json({ error: 'Error creating animal' });
  }
};

export const updateAnimal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log('Update animal request body:', req.body);
    
    const {
      name,
      species,
      category,
      habitat,
      description,
      imageUrl,
      diet,
      lifespan,
      status
    } = req.body;

    // Build update data object with only provided fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (species !== undefined) updateData.species = species;
    if (category !== undefined) updateData.category = category;
    if (habitat !== undefined) updateData.habitat = habitat;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (diet !== undefined) updateData.diet = diet;
    if (lifespan !== undefined) updateData.lifespan = lifespan;
    if (status !== undefined) updateData.status = status;

    const animal = await prisma.animal.update({
      where: { id },
      data: updateData,
    });

    // Invalidate animal caches
    invalidateCache.animalById(id);

    res.json(animal);
  } catch (error) {
    console.error('Update animal error:', error);
    res.status(500).json({ error: 'Error updating animal' });
  }
};

export const deleteAnimal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.animal.delete({
      where: { id },
    });

    // Invalidate animal caches
    invalidateCache.animalById(id);

    res.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    console.error('Delete animal error:', error);
    res.status(500).json({ error: 'Error deleting animal' });
  }
};

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { animalId } = req.params;
    const userId = req.user!.id;

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_animalId: {
          userId,
          animalId,
        },
      },
    });

    if (existing) {
      // Remove from favorites
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      
      // Invalidate animal cache (favorites count changed)
      invalidateCache.animalById(animalId);
      
      res.json({ favorited: false });
    } else {
      // Add to favorites
      await prisma.favorite.create({
        data: {
          userId,
          animalId,
        },
      });
      
      // Invalidate animal cache (favorites count changed)
      invalidateCache.animalById(animalId);
      
      res.json({ favorited: true });
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Error toggling favorite' });
  }
};

export const getUserFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        animal: {
          include: {
            _count: {
              select: { reviews: true },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json(favorites.map((fav: any) => fav.animal));
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Error fetching favorites' });
  }
};


