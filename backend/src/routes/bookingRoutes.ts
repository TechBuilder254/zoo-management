import { Router } from 'express';
import * as bookingController from '../controllers/bookingController';
import { auth, staffOrAdmin } from '../middleware/auth';
import { bookingValidation } from '../utils/validators';

const router = Router();

// Admin routes (more specific, must come first)
router.get('/admin/all', auth, staffOrAdmin, bookingController.getAllBookings);
router.patch('/:id/status', auth, staffOrAdmin, bookingController.updateBookingStatus);

// User routes  
router.get('/my-bookings', auth, bookingController.getUserBookings);
router.post('/', auth, bookingValidation, bookingController.createBooking);
router.get('/:id', auth, bookingController.getBookingById);
router.patch('/:id/cancel', auth, bookingController.cancelBooking);

export default router;


