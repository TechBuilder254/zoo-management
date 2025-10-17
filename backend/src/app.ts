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
import settingsRoutes from './routes/settingsRoutes';
import healthRoutes from './routes/healthRoutes';
import configRoutes from './routes/configRoutes';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler';
import { smartRateLimit } from './middleware/smartRateLimit';
import { smartCache } from './middleware/cacheMiddleware';

const app = express();

// Middleware - Dynamic CORS based on environment
const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://widlife-zoo-system.vercel.app'
];

// Add FRONTEND_URL if it's different from the defaults
if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply smart rate limiting (only limits writes, not reads)
app.use(smartRateLimit);

// Apply smart caching for GET requests
app.use('/api', smartCache);

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
app.use('/api/settings', settingsRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/config', configRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;


