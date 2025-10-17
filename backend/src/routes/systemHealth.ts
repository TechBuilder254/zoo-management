import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import redisCache from '../utils/redisCache';

const router = Router();
const prisma = new PrismaClient();

// System health check endpoint
router.get('/', async (req, res) => {
  const healthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      redis: 'unknown',
      api: 'ok'
    },
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  };

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    healthStatus.services.database = 'connected';
  } catch (error) {
    healthStatus.services.database = 'disconnected';
    healthStatus.status = 'error';
  }

  try {
    // Check Redis connection
    await redisCache.set('health-check', 'ok', 10);
    const testValue = await redisCache.get('health-check');
    if (testValue === 'ok') {
      healthStatus.services.redis = 'connected';
    } else {
      healthStatus.services.redis = 'disconnected';
    }
  } catch (error) {
    healthStatus.services.redis = 'disconnected';
    healthStatus.status = 'error';
  }

  // Return appropriate status code
  const statusCode = healthStatus.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(healthStatus);
});

export default router;
