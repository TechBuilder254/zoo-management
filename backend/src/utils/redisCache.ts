import { createClient, RedisClientType } from 'redis';
import NodeCache from 'node-cache';

/**
 * Hybrid Cache Manager - Redis with NodeCache fallback
 * Uses Redis when available, falls back to NodeCache when Redis is not installed
 */
class HybridCacheManager {
  private redisClient: RedisClientType | null = null;
  private fallbackCache: NodeCache;
  private isRedisAvailable: boolean = false;
  private isConnected: boolean = false;

  constructor() {
    // Initialize fallback cache
    this.fallbackCache = new NodeCache({
      stdTTL: 300, // 5 minutes default
      checkperiod: 60,
      useClones: false,
    });

    // Try to initialize Redis
    this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      // Check if we have Upstash REST API credentials
      if (process.env.REDIS_REST_URL && process.env.REDIS_REST_TOKEN) {
        console.log('🔗 Using Upstash Redis REST API...');
        this.isRedisAvailable = true;
        this.isConnected = true;
        return;
      }

      // Fallback to direct Redis connection
      let redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      // For Upstash Redis, ensure we use rediss:// for TLS
      if (redisUrl.includes('upstash.io') && !redisUrl.startsWith('rediss://')) {
        redisUrl = redisUrl.replace('redis://', 'rediss://');
      }
      
      this.redisClient = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
          connectTimeout: 10000,
          lazyConnect: true,
        },
        database: 0,
      });

      this.redisClient.on('error', (err) => {
        console.warn('⚠️  Redis connection error, using fallback cache:', err.message);
        this.isRedisAvailable = false;
        this.isConnected = false;
      });

      this.redisClient.on('connect', () => {
        console.log('🔗 Redis connecting to cloud instance...');
        this.isRedisAvailable = true;
      });

      this.redisClient.on('ready', () => {
        console.log('✅ Redis connected and ready for operations');
        this.isConnected = true;
      });

      this.redisClient.on('end', () => {
        console.log('❌ Redis connection ended, using fallback cache');
        this.isConnected = false;
      });

      // Try to connect to Redis, but don't fail if it doesn't work
      try {
        await this.connect();
      } catch (error) {
        console.warn('⚠️  Redis connection failed, using fallback cache:', error);
        this.isRedisAvailable = false;
        this.isConnected = false;
      }
    } catch (error: any) {
      console.warn('⚠️  Redis initialization failed, using fallback cache:', error?.message || error);
      this.isRedisAvailable = false;
      this.isConnected = false;
    }
  }

  private async connect(): Promise<void> {
    if (!this.redisClient) {
      throw new Error('Redis client not initialized');
    }

    // Connect with timeout
    const connectPromise = this.redisClient.connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Redis connection timeout')), 15000)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);
  }

  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    // Try Upstash REST API first
    if (this.isRedisAvailable && process.env.REDIS_REST_URL && process.env.REDIS_REST_TOKEN) {
      try {
        const response = await fetch(`${process.env.REDIS_REST_URL}/get/${encodeURIComponent(key)}`, {
          headers: {
            'Authorization': `Bearer ${process.env.REDIS_REST_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          return data.result ? JSON.parse(data.result) : null;
        }
      } catch (error: any) {
        console.warn('Upstash REST API GET error, using fallback:', error?.message || error);
      }
    }

    // Try direct Redis connection if available
    if (this.isConnected && this.redisClient) {
      try {
        const value = await this.redisClient.get(key);
        return value ? JSON.parse(value) : null;
      } catch (error: any) {
        console.warn('Redis GET error, using fallback:', error?.message || error);
      }
    }

    // Fallback to NodeCache
    try {
      const value = this.fallbackCache.get<T>(key);
      return value || null;
    } catch (error: any) {
      console.error('Fallback cache GET error:', error?.message || error);
      return null;
    }
  }

  /**
   * Set a value in cache with TTL
   */
  async set<T>(key: string, value: T, ttlSeconds: number = 300): Promise<boolean> {
    // Try Upstash REST API first
    if (this.isRedisAvailable && process.env.REDIS_REST_URL && process.env.REDIS_REST_TOKEN) {
      try {
        const response = await fetch(`${process.env.REDIS_REST_URL}/setex/${encodeURIComponent(key)}/${ttlSeconds}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.REDIS_REST_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ value: JSON.stringify(value) })
        });
        
        if (response.ok) {
          return true;
        }
      } catch (error: any) {
        console.warn('Upstash REST API SET error, using fallback:', error?.message || error);
      }
    }

    // Try direct Redis connection if available
    if (this.isConnected && this.redisClient) {
      try {
        await this.redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
        return true;
      } catch (error: any) {
        console.warn('Redis SET error, using fallback:', error?.message || error);
      }
    }

    // Fallback to NodeCache
    try {
      return this.fallbackCache.set(key, value, ttlSeconds);
    } catch (error: any) {
      console.error('Fallback cache SET error:', error?.message || error);
      return false;
    }
  }

  /**
   * Delete a key from cache
   */
  async del(key: string | string[]): Promise<number> {
    // Try Redis first if available
    if (this.isConnected && this.redisClient) {
      try {
        return await this.redisClient.del(key);
      } catch (error: any) {
        console.warn('Redis DEL error, using fallback:', error?.message || error);
      }
    }

    // Fallback to NodeCache
    try {
      return this.fallbackCache.del(key);
    } catch (error: any) {
      console.error('Fallback cache DEL error:', error?.message || error);
      return 0;
    }
  }

  /**
   * Delete keys matching a pattern
   */
  async delByPattern(pattern: string): Promise<number> {
    // Try Redis first if available
    if (this.isConnected && this.redisClient) {
      try {
        const keys = await this.redisClient.keys(pattern);
        if (keys.length === 0) return 0;
        return await this.redisClient.del(keys);
      } catch (error: any) {
        console.warn('Redis DEL pattern error, using fallback:', error?.message || error);
      }
    }

    // Fallback to NodeCache
    try {
      const keys = this.fallbackCache.keys();
      const matchingKeys = keys.filter(key => key.includes(pattern));
      return this.fallbackCache.del(matchingKeys);
    } catch (error: any) {
      console.error('Fallback cache DEL pattern error:', error?.message || error);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async has(key: string): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      return await this.redisClient!.exists(key) === 1;
    } catch (error: any) {
      console.error('Redis EXISTS error:', error?.message || error);
      return false;
    }
  }

  /**
   * Get multiple keys at once
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    if (!this.isConnected || keys.length === 0) {
      return [];
    }

    try {
      const values = await this.redisClient!.mGet(keys);
      return values.map((value: string | null) => value ? JSON.parse(value) : null);
    } catch (error: any) {
      console.error('Redis MGET error:', error?.message || error);
      return [];
    }
  }

  /**
   * Set multiple key-value pairs
   */
  async mset<T>(keyValuePairs: Record<string, T>, ttlSeconds: number = 300): Promise<boolean> {
    if (!this.isConnected || Object.keys(keyValuePairs).length === 0) {
      return false;
    }

    try {
      const pipeline = this.redisClient!.multi();
      
      Object.entries(keyValuePairs).forEach(([key, value]) => {
        pipeline.setEx(key, ttlSeconds, JSON.stringify(value));
      });

      await pipeline.exec();
      return true;
    } catch (error: any) {
      console.error('Redis MSET error:', error?.message || error);
      return false;
    }
  }

  /**
   * Increment a numeric value
   */
  async incr(key: string, increment: number = 1): Promise<number> {
    if (!this.isConnected) {
      return 0;
    }

    try {
      return await this.redisClient!.incrBy(key, increment);
    } catch (error: any) {
      console.error('Redis INCR error:', error?.message || error);
      return 0;
    }
  }

  /**
   * Set expiration for existing key
   */
  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      const result = await this.redisClient!.expire(key, ttlSeconds);
      return result === 1;
    } catch (error: any) {
      console.error('Redis EXPIRE error:', error?.message || error);
      return false;
    }
  }

  /**
   * Get TTL for a key
   */
  async ttl(key: string): Promise<number> {
    if (!this.isConnected) {
      return -1;
    }

    try {
      return await this.redisClient!.ttl(key);
    } catch (error: any) {
      console.error('Redis TTL error:', error?.message || error);
      return -1;
    }
  }

  /**
   * Flush all data (use with caution!)
   */
  async flush(): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      await this.redisClient!.flushDb();
      return true;
    } catch (error: any) {
      console.error('Redis FLUSH error:', error?.message || error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<any> {
    if (!this.isConnected) {
      return { connected: false };
    }

    try {
      const info = await this.redisClient!.info('memory');
      const dbSize = await this.redisClient!.dbSize();
      
      return {
        connected: true,
        dbSize,
        memoryInfo: info,
      };
    } catch (error: any) {
      console.error('Redis STATS error:', error?.message || error);
      return { connected: false, error: error?.message || error };
    }
  }

  /**
   * Health check
   */
  async ping(): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      const result = await this.redisClient!.ping();
      return result === 'PONG';
    } catch (error: any) {
      console.error('Redis PING error:', error?.message || error);
      return false;
    }
  }

  /**
   * Gracefully close connection
   */
  async disconnect(): Promise<void> {
    try {
      await this.redisClient!.quit();
      this.isConnected = false;
    } catch (error: any) {
      console.error('Redis disconnect error:', error?.message || error);
    }
  }
}

// Export singleton instance
export const redisCache = new HybridCacheManager();

/**
 * Cache key builders for consistent naming
 */
export const CacheKeys = {
  // Animal cache keys with longer TTL
  ANIMALS_ALL: 'animals:all',
  ANIMALS_FILTERED: (params: string) => `animals:filtered:${params}`,
  ANIMAL_BY_ID: (id: string) => `animal:${id}`,
  ANIMALS_POPULAR: 'animals:popular',
  ANIMALS_RECENT: 'animals:recent',
  
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
  EVENTS_UPCOMING: 'events:upcoming',
  
  // Ticket cache keys (long TTL)
  TICKETS_ALL: 'tickets:all',
  TICKETS_ACTIVE: 'tickets:active',
  
  // Promo code cache keys
  PROMOS_ALL: 'promos:all',
  PROMO_BY_CODE: (code: string) => `promo:code:${code}`,
  
  // Stats cache keys
  STATS_DASHBOARD: 'stats:dashboard',
  STATS_ANALYTICS: 'stats:analytics',
  STATS_REALTIME: 'stats:realtime',
  
  // Health cache keys
  HEALTH_ALL: 'health:all',
  HEALTH_STATS: 'health:stats',
  HEALTH_ALERTS: 'health:alerts',
  
  // User session cache
  USER_SESSION: (userId: string) => `user:session:${userId}`,
  USER_FAVORITES: (userId: string) => `user:favorites:${userId}`,
};

/**
 * Cache TTL configurations (in seconds)
 */
export const CacheTTL = {
  // Long-term caches (rarely change)
  ANIMALS: 3600,        // 1 hour
  ANIMAL_DETAILS: 1800, // 30 minutes
  TICKETS: 7200,        // 2 hours
  EVENTS: 1800,         // 30 minutes
  
  // Medium-term caches
  REVIEWS: 900,         // 15 minutes
  BOOKINGS: 300,        // 5 minutes
  STATS: 600,           // 10 minutes
  
  // Short-term caches (frequently change)
  USER_DATA: 180,       // 3 minutes
  SEARCH_RESULTS: 300,  // 5 minutes
  SESSION_DATA: 1800,   // 30 minutes
};

/**
 * Enhanced cache invalidation helpers
 */
export const invalidateCache = {
  // Invalidate all animal-related caches
  animals: async () => {
    await redisCache.delByPattern('animals:*');
    await redisCache.delByPattern('animal:*');
  },
  
  // Invalidate specific animal cache
  animalById: async (id: string) => {
    await redisCache.del(CacheKeys.ANIMAL_BY_ID(id));
    await invalidateCache.animals();
  },
  
  // Invalidate all review-related caches
  reviews: async () => {
    await redisCache.delByPattern('reviews:*');
    await invalidateCache.animals();
  },
  
  // Invalidate reviews for specific animal
  reviewsByAnimal: async (animalId: string) => {
    await redisCache.del(CacheKeys.REVIEWS_BY_ANIMAL(animalId));
    await redisCache.del(CacheKeys.ANIMAL_BY_ID(animalId));
    await invalidateCache.reviews();
  },
  
  // Invalidate all booking-related caches
  bookings: async () => {
    await redisCache.delByPattern('bookings:*');
    await invalidateCache.stats();
  },
  
  // Invalidate user's bookings
  bookingsByUser: async (userId: string) => {
    await redisCache.del(CacheKeys.BOOKINGS_USER(userId));
    await invalidateCache.bookings();
  },
  
  // Invalidate all event-related caches
  events: async () => {
    await redisCache.delByPattern('events:*');
    await redisCache.delByPattern('event:*');
  },
  
  // Invalidate specific event cache
  eventById: async (id: string) => {
    await redisCache.del(CacheKeys.EVENT_BY_ID(id));
    await invalidateCache.events();
  },
  
  // Invalidate all ticket-related caches
  tickets: async () => {
    await redisCache.delByPattern('tickets:*');
  },
  
  // Invalidate all promo code-related caches
  promos: async () => {
    await redisCache.delByPattern('promos:*');
    await redisCache.delByPattern('promo:*');
  },
  
  // Invalidate all stats-related caches
  stats: async () => {
    await redisCache.delByPattern('stats:*');
  },
  
  // Invalidate all health-related caches
  health: async () => {
    await redisCache.delByPattern('health:*');
  },
  
  // Invalidate user-related caches
  userData: async (userId: string) => {
    await redisCache.del(CacheKeys.USER_SESSION(userId));
    await redisCache.del(CacheKeys.USER_FAVORITES(userId));
    await invalidateCache.bookingsByUser(userId);
  },
  
  // Invalidate everything
  all: async () => {
    await redisCache.flush();
  },
};
