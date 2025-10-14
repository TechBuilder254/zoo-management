import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes';
import animalRoutes from './routes/animalRoutes';
import reviewRoutes from './routes/reviewRoutes';
import bookingRoutes from './routes/bookingRoutes';
import eventRoutes from './routes/eventRoutes';
import staffRoutes from './routes/staffRoutes';
import statsRoutes from './routes/statsRoutes';
import ticketRoutes from './routes/ticketRoutes';
import promoRoutes from './routes/promoRoutes';
import financialRoutes from './routes/financialRoutes';
import newsletterRoutes from './routes/newsletterRoutes';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Zoo API is running!' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;


