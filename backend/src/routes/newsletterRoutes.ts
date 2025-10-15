import { Router } from 'express';
import { auth, staffOrAdmin } from '../middleware/auth';
import { subscribe, unsubscribe, getAllSubscribers } from '../controllers/newsletterController';

const router = Router();

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Admin routes
router.get('/subscribers', auth, staffOrAdmin, getAllSubscribers);

export default router;


