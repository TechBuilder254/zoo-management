import { Router } from 'express';
import * as animalController from '../controllers/animalController';
import { auth, adminOnly, staffOrAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', animalController.getAllAnimals);
router.get('/:id', animalController.getAnimalById);

// Protected routes
router.post('/', auth, staffOrAdmin, animalController.createAnimal);
router.put('/:id', auth, staffOrAdmin, animalController.updateAnimal);
router.delete('/:id', auth, adminOnly, animalController.deleteAnimal);

// Favorites
router.post('/:animalId/favorite', auth, animalController.toggleFavorite);
router.get('/user/favorites', auth, animalController.getUserFavorites);

export default router;


