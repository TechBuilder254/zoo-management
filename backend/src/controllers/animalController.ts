import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAllAnimals = async (req: Request, res: Response) => {
  try {
    const { category, status, search } = req.query;

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

    const animals = await prisma.animal.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { reviews: true, favorites: true },
        },
      },
    });

    res.json(animals);
  } catch (error) {
    console.error('Get animals error:', error);
    res.status(500).json({ error: 'Error fetching animals' });
  }
};

export const getAnimalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const animal = await prisma.animal.findUnique({
      where: { id },
      include: {
        reviews: {
          where: { status: 'APPROVED' },
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { favorites: true },
        },
      },
    });

    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }

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
      res.json({ favorited: false });
    } else {
      // Add to favorites
      await prisma.favorite.create({
        data: {
          userId,
          animalId,
        },
      });
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
      orderBy: { createdAt: 'desc' },
    });

    res.json(favorites.map(fav => fav.animal));
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Error fetching favorites' });
  }
};


