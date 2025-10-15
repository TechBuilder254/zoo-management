import { Request, Response, NextFunction } from 'express';
import { cacheManager } from '../utils/cache';

/**
 * Cache middleware for GET requests
 * Caches responses based on URL and query parameters
 */
export const cacheMiddleware = (ttl: number = 300) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key from URL and query params
    const cacheKey = generateCacheKey(req);

    // Try to get from cache
    const cachedData = cacheManager.get(cacheKey);

    if (cachedData) {
      // Return cached response
      return res.json(cachedData);
    }

    // Store original res.json function
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = function (data: any) {
      // Cache the response data
      cacheManager.set(cacheKey, data, ttl);
      
      // Call original json function
      return originalJson(data);
    };

    next();
  };
};

/**
 * Generate a unique cache key from request
 */
const generateCacheKey = (req: Request): string => {
  const path = req.path;
  const queryString = JSON.stringify(req.query);
  const userId = (req as any).user?.id || 'anonymous';
  
  return `${path}:${queryString}:${userId}`;
};

/**
 * Smart cache middleware that uses different TTLs based on data type
 */
export const smartCache = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path;
  
  // Different TTLs for different endpoints
  let ttl = 300; // 5 minutes default
  
  if (path.includes('/animals')) {
    ttl = 600; // 10 minutes for animals (rarely changes)
  } else if (path.includes('/reviews')) {
    ttl = 180; // 3 minutes for reviews (moderately dynamic)
  } else if (path.includes('/bookings')) {
    ttl = 60; // 1 minute for bookings (frequently changes)
  } else if (path.includes('/stats')) {
    ttl = 300; // 5 minutes for stats
  } else if (path.includes('/events')) {
    ttl = 600; // 10 minutes for events
  } else if (path.includes('/tickets')) {
    ttl = 3600; // 1 hour for tickets (rarely changes)
  }
  
  return cacheMiddleware(ttl)(req, res, next);
};

