import express from 'express';
import { auth } from '../middleware/auth';
import {
  getSettings,
  updateSettings,
  resetSettings,
  clearAllData
} from '../controllers/settingsController';

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/settings - Get system settings
router.get('/', getSettings);

// PUT /api/settings - Update system settings
router.put('/', updateSettings);

// POST /api/settings/reset - Reset settings to default
router.post('/reset', resetSettings);

// DELETE /api/settings/clear-data - Clear all data (dangerous)
router.delete('/clear-data', clearAllData);

export default router;

