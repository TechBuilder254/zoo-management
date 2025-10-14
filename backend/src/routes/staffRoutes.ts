import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} from '../controllers/staffController';

const router = Router();

// All routes require authentication
router.use(auth);

// GET /api/staff - Get all staff members
router.get('/', getAllStaff);

// GET /api/staff/:id - Get staff member by ID
router.get('/:id', getStaffById);

// POST /api/staff - Create new staff member
router.post('/', createStaff);

// PUT /api/staff/:id - Update staff member
router.put('/:id', updateStaff);

// DELETE /api/staff/:id - Delete staff member
router.delete('/:id', deleteStaff);

export default router;
