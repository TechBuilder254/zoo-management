import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  getTicketPrices,
  getTicketPriceByType,
  updateTicketPrice,
  createTicketPrice,
  deleteTicketPrice
} from '../controllers/ticketController';

const router = Router();

// Public routes (ticket prices should be visible to everyone)
router.get('/', getTicketPrices); // GET /api/tickets
router.get('/prices', getTicketPrices);
router.get('/prices/:type', getTicketPriceByType);

// Admin routes
router.use(auth); // All routes below require authentication
router.post('/', createTicketPrice);
router.put('/:type', updateTicketPrice);
router.delete('/:id', deleteTicketPrice);

export default router;
