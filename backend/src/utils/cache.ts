import NodeCache from 'node-cache';

/**
 * Cache utility for optimizing database queries
 * Uses in-memory caching with TTL (Time To Live)
 */
class CacheManager {
  private cache: NodeCache;

  constructor() {
    // Initialize cache with default TTL of 5 minutes
    this.cache = new NodeCache({
      stdTTL: 300, // 5 minutes default
      checkperiod: 60, // Check for expired keys every 60 seconds
      useClones: false, // Better performance, be careful with mutations
    });
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Set a value in cache with optional custom TTL
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || 300);
  }

  /**
   * Delete a specific key from cache
   */
  del(key: string | string[]): number {
    return this.cache.del(key);
  }

  /**
   * Delete all keys matching a pattern
   */
  delByPattern(pattern: string): number {
    const keys = this.cache.keys();
    const matchingKeys = keys.filter(key => key.includes(pattern));
    return this.cache.del(matchingKeys);
  }

  /**
   * Clear entire cache
   */
  flush(): void {
    this.cache.flushAll();
  }

  /**
   * Check if a key exists in cache
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return this.cache.getStats();
  }

  /**
   * Get all keys in cache
   */
  keys(): string[] {
    return this.cache.keys();
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

/**
 * Cache key builders for consistent naming
 */
export const CacheKeys = {
  // Animal cache keys
  ANIMALS_ALL: 'animals:all',
  ANIMALS_FILTERED: (params: string) => `animals:filtered:${params}`,
  ANIMAL_BY_ID: (id: string) => `animal:${id}`,
  
  // Review cache keys
  REVIEWS_ALL: 'reviews:all',
  REVIEWS_BY_ANIMAL: (animalId: string) => `reviews:animal:${animalId}`,
  REVIEWS_FILTERED: (params: string) => `reviews:filtered:${params}`,
  
  // Booking cache keys
  BOOKINGS_ALL: 'bookings:all',
  BOOKINGS_USER: (userId: string) => `bookings:user:${userId}`,
  BOOKINGS_FILTERED: (params: string) => `bookings:filtered:${params}`,
  
  // Event cache keys
  EVENTS_ALL: 'events:all',
  EVENT_BY_ID: (id: string) => `event:${id}`,
  
  // Ticket cache keys
  TICKETS_ALL: 'tickets:all',
  TICKETS_ACTIVE: 'tickets:active',
  
  // Promo code cache keys
  PROMOS_ALL: 'promos:all',
  PROMO_BY_CODE: (code: string) => `promo:code:${code}`,
  
  // Stats cache keys
  STATS_DASHBOARD: 'stats:dashboard',
  STATS_ANALYTICS: 'stats:analytics',
  
  // Health cache keys
  HEALTH_ALL: 'health:all',
  HEALTH_STATS: 'health:stats',
  HEALTH_APPOINTMENTS: 'health:appointments',
  HEALTH_ALERTS: 'health:alerts',
};

/**
 * Cache invalidation helpers
 */
export const invalidateCache = {
  // Invalidate all animal-related caches
  animals: () => {
    cacheManager.delByPattern('animals:');
    cacheManager.delByPattern('animal:');
  },
  
  // Invalidate specific animal cache
  animalById: (id: string) => {
    cacheManager.del(CacheKeys.ANIMAL_BY_ID(id));
    invalidateCache.animals(); // Also invalidate lists
  },
  
  // Invalidate all review-related caches
  reviews: () => {
    cacheManager.delByPattern('reviews:');
    invalidateCache.animals(); // Reviews affect animal data
  },
  
  // Invalidate reviews for specific animal
  reviewsByAnimal: (animalId: string) => {
    cacheManager.del(CacheKeys.REVIEWS_BY_ANIMAL(animalId));
    cacheManager.del(CacheKeys.ANIMAL_BY_ID(animalId));
    invalidateCache.reviews();
  },
  
  // Invalidate all booking-related caches
  bookings: () => {
    cacheManager.delByPattern('bookings:');
    invalidateCache.stats(); // Bookings affect stats
  },
  
  // Invalidate user's bookings
  bookingsByUser: (userId: string) => {
    cacheManager.del(CacheKeys.BOOKINGS_USER(userId));
    invalidateCache.bookings();
  },
  
  // Invalidate all event-related caches
  events: () => {
    cacheManager.delByPattern('events:');
    cacheManager.delByPattern('event:');
  },
  
  // Invalidate specific event cache
  eventById: (id: string) => {
    cacheManager.del(CacheKeys.EVENT_BY_ID(id));
    invalidateCache.events();
  },
  
  // Invalidate all ticket-related caches
  tickets: () => {
    cacheManager.delByPattern('tickets:');
  },
  
  // Invalidate all promo code-related caches
  promos: () => {
    cacheManager.delByPattern('promos:');
    cacheManager.delByPattern('promo:');
  },
  
  // Invalidate all stats-related caches
  stats: () => {
    cacheManager.delByPattern('stats:');
  },
  
  // Invalidate all health-related caches
  health: () => {
    cacheManager.delByPattern('health:');
  },
  
  // Invalidate everything
  all: () => {
    cacheManager.flush();
  },
};

