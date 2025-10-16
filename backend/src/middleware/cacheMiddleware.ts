import { Request, Response, NextFunction } from 'express';
import { redisCache, CacheKeys, CacheTTL } from '../utils/redisCache';

/**
 * Enhanced cache middleware using Redis for better performance
 * Only caches GET requests to avoid stale data issues
 */
export const cacheMiddleware = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key from URL and query params
    const cacheKey = generateCacheKey(req);

    try {
      // Try to get from Redis cache
      const cachedData = await redisCache.get(cacheKey);

      if (cachedData) {
        // Add cache headers for browser caching
        res.set({
          'X-Cache': 'HIT',
          'X-Cache-Key': cacheKey,
          'Cache-Control': 'public, max-age=300' // 5 minutes browser cache
        });
        
        // Return cached response
        return res.json(cachedData);
      }

      // Store original res.json function
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = function (data: any) {
        // Add cache headers
        res.set({
          'X-Cache': 'MISS',
          'X-Cache-Key': cacheKey,
          'Cache-Control': 'public, max-age=300'
        });

        // Cache the response data in Redis
        redisCache.set(cacheKey, data, ttl).catch(error => {
          console.error('Cache set error:', error);
        });
        
        // Call original json function
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      // If caching fails, continue without caching
      next();
    }
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
 * Uses Redis for better performance and scalability
 */
export const smartCache = (req: Request, res: Response, next: NextFunction) => {
  const path = req.path;
  
  // Different TTLs for different endpoints using CacheTTL constants
  let ttl = CacheTTL.SEARCH_RESULTS; // Default
  
  if (path.includes('/animals')) {
    if (path.match(/\/animals\/[^\/]+$/)) {
      ttl = CacheTTL.ANIMAL_DETAILS; // Individual animal details
    } else {
      ttl = CacheTTL.ANIMALS; // Animal listings
    }
  } else if (path.includes('/reviews')) {
    ttl = CacheTTL.REVIEWS;
  } else if (path.includes('/bookings')) {
    ttl = CacheTTL.BOOKINGS;
  } else if (path.includes('/stats')) {
    ttl = CacheTTL.STATS;
  } else if (path.includes('/events')) {
    ttl = CacheTTL.EVENTS;
  } else if (path.includes('/tickets')) {
    ttl = CacheTTL.TICKETS;
  } else if (path.includes('/search')) {
    ttl = CacheTTL.SEARCH_RESULTS;
  }
  
  return cacheMiddleware(ttl)(req, res, next);
};

/**
 * Aggressive caching for rarely changing data
 */
export const aggressiveCache = cacheMiddleware(CacheTTL.ANIMALS);

/**
 * Light caching for frequently changing data
 */
export const lightCache = cacheMiddleware(CacheTTL.BOOKINGS);

/**
 * No caching for real-time data
 */
export const noCache = (req: Request, res: Response, next: NextFunction) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
};

