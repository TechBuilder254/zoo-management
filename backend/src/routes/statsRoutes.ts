import { Router } from 'express';
import { auth } from '../middleware/auth';
import { getDashboardStats } from '../controllers/statsController';

const router = Router();

// All routes require authentication
router.use(auth);

// GET /api/stats/dashboard - Get dashboard statistics
router.get('/dashboard', getDashboardStats);

export default router;
