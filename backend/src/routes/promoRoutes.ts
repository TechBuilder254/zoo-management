import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  getAllPromoCodes,
  getPromoCodeById,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  validatePromoCode
} from '../controllers/promoController';

const router = Router();

// Public route
router.post('/validate/:code', validatePromoCode);

// Admin routes
router.use(auth); // All routes below require authentication
router.get('/', getAllPromoCodes);
router.get('/:id', getPromoCodeById);
router.post('/', createPromoCode);
router.put('/:id', updatePromoCode);
router.delete('/:id', deletePromoCode);

export default router;
