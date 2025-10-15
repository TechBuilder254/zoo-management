import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { auth, staffOrAdmin } from '../middleware/auth';
import { reviewValidation } from '../utils/validators';

const router = Router();

// Admin routes (more specific, must come first)
router.get('/admin/all', auth, staffOrAdmin, reviewController.getAllReviews);
router.patch('/:id/status', auth, staffOrAdmin, reviewController.updateReviewStatus);
router.patch('/:id/sentiment', auth, reviewController.updateReviewSentiment);

// Public routes
router.get('/animal/:animalId', reviewController.getReviewsByAnimal);

// Protected routes
router.post('/', auth, reviewValidation, reviewController.createReview);
router.delete('/:id', auth, reviewController.deleteReview);

export default router;


