import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  getHealthRecords,
  getHealthRecordById,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  getHealthStats,
  getUpcomingAppointments,
  getHealthAlerts
} from '../controllers/healthController';

const router = Router();

// Public routes (no auth required for basic stats)
router.get('/stats', getHealthStats);
router.get('/appointments', getUpcomingAppointments);
router.get('/alerts', getHealthAlerts);

// Protected routes
router.use(auth); // All routes below require authentication

router.get('/', getHealthRecords);
router.get('/:id', getHealthRecordById);
router.post('/', createHealthRecord);
router.put('/:id', updateHealthRecord);
router.delete('/:id', deleteHealthRecord);

export default router;
