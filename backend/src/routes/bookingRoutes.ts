import { Router } from 'express';
import * as bookingController from '../controllers/bookingController';
import { auth, staffOrAdmin } from '../middleware/auth';
import { bookingValidation } from '../utils/validators';

const router = Router();

// User routes
router.post('/', auth, bookingValidation, bookingController.createBooking);
router.get('/my-bookings', auth, bookingController.getUserBookings);
router.get('/:id', auth, bookingController.getBookingById);
router.patch('/:id/cancel', auth, bookingController.cancelBooking);

// Admin routes
router.get('/admin/all', auth, staffOrAdmin, bookingController.getAllBookings);
router.patch('/:id/status', auth, staffOrAdmin, bookingController.updateBookingStatus);

export default router;


