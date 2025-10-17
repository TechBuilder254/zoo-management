import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from '../src/routes/authRoutes';
import animalRoutes from '../src/routes/animalRoutes';
import reviewRoutes from '../src/routes/reviewRoutes';
import bookingRoutes from '../src/routes/bookingRoutes';
import eventRoutes from '../src/routes/eventRoutes';
import staffRoutes from '../src/routes/staffRoutes';
import statsRoutes from '../src/routes/statsRoutes';
import promoRoutes from '../src/routes/promoRoutes';
import financialRoutes from '../src/routes/financialRoutes';
import newsletterRoutes from '../src/routes/newsletterRoutes';
import settingsRoutes from '../src/routes/settingsRoutes';
import healthRoutes from '../src/routes/healthRoutes';
import configRoutes from '../src/routes/configRoutes';
import systemHealthRoutes from '../src/routes/systemHealth';

// Import middleware
import { errorHandler, notFound } from '../src/middleware/errorHandler';
import { smartRateLimit } from '../src/middleware/smartRateLimit';
import { smartCache } from '../src/middleware/cacheMiddleware';

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

// System health check with detailed status
app.use('/api/health', systemHealthRoutes);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/health-records', healthRoutes);
app.use('/api/config', configRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
