import { Router } from 'express';
import * as eventController from '../controllers/eventController';
import { auth, staffOrAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Protected routes (admin/staff only)
router.post('/', auth, staffOrAdmin, eventController.createEvent);
router.put('/:id', auth, staffOrAdmin, eventController.updateEvent);
router.delete('/:id', auth, staffOrAdmin, eventController.deleteEvent);

export default router;

