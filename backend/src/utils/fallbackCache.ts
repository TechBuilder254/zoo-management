/**
 * Fallback cache system using NodeCache when Redis is not available
 * This ensures the system works even without Redis installed
 */
import NodeCache from 'node-cache';

class FallbackCacheManager {
  private cache: NodeCache;
  private isRedisAvailable: boolean = false;

  constructor() {
    // Initialize fallback cache with default TTL of 5 minutes
    this.cache = new NodeCache({
      stdTTL: 300, // 5 minutes default
      checkperiod: 60, // Check for expired keys every 60 seconds
      useClones: false, // Better performance, be careful with mutations
    });
  }

  /**
   * Set Redis availability status
   */
  setRedisAvailable(available: boolean) {
    this.isRedisAvailable = available;
  }

  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = this.cache.get<T>(key);
      return value || null;
    } catch (error) {
      console.error('Fallback cache GET error:', error);
      return null;
    }
  }

  /**
   * Set a value in cache with TTL
   */
  async set<T>(key: string, value: T, ttlSeconds: number = 300): Promise<boolean> {
    try {
      return this.cache.set(key, value, ttlSeconds);
    } catch (error) {
      console.error('Fallback cache SET error:', error);
      return false;
    }
  }

  /**
   * Delete a key from cache
   */
  async del(key: string | string[]): Promise<number> {
    try {
      return this.cache.del(key);
    } catch (error) {
      console.error('Fallback cache DEL error:', error);
      return 0;
    }
  }

  /**
   * Delete keys matching a pattern
   */
  async delByPattern(pattern: string): Promise<number> {
    try {
      const keys = this.cache.keys();
      const matchingKeys = keys.filter(key => key.includes(pattern));
      return this.cache.del(matchingKeys);
    } catch (error) {
      console.error('Fallback cache DEL pattern error:', error);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async has(key: string): Promise<boolean> {
    try {
      return this.cache.has(key);
    } catch (error) {
      console.error('Fallback cache EXISTS error:', error);
      return false;
    }
  }

  /**
   * Get multiple keys at once
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      if (keys.length === 0) return [];
      const values = this.cache.mget(keys);
      return keys.map(key => values[key] || null);
    } catch (error) {
      console.error('Fallback cache MGET error:', error);
      return [];
    }
  }

  /**
   * Set multiple key-value pairs
   */
  async mset<T>(keyValuePairs: Record<string, T>, ttlSeconds: number = 300): Promise<boolean> {
    try {
      if (Object.keys(keyValuePairs).length === 0) return false;
      
      Object.entries(keyValuePairs).forEach(([key, value]) => {
        this.cache.set(key, value, ttlSeconds);
      });
      
      return true;
    } catch (error) {
      console.error('Fallback cache MSET error:', error);
      return false;
    }
  }

  /**
   * Increment a numeric value
   */
  async incr(key: string, increment: number = 1): Promise<number> {
    try {
      const current = this.cache.get<number>(key) || 0;
      const newValue = current + increment;
      this.cache.set(key, newValue);
      return newValue;
    } catch (error) {
      console.error('Fallback cache INCR error:', error);
      return 0;
    }
  }

  /**
   * Set expiration for existing key
   */
  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    try {
      if (this.cache.has(key)) {
        this.cache.ttl(key, ttlSeconds);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Fallback cache EXPIRE error:', error);
      return false;
    }
  }

  /**
   * Get TTL for a key
   */
  async ttl(key: string): Promise<number> {
    try {
      return this.cache.getTtl(key) || -1;
    } catch (error) {
      console.error('Fallback cache TTL error:', error);
      return -1;
    }
  }

  /**
   * Flush all data
   */
  async flush(): Promise<boolean> {
    try {
      this.cache.flushAll();
      return true;
    } catch (error) {
      console.error('Fallback cache FLUSH error:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<any> {
    try {
      const stats = this.cache.getStats();
      return {
        connected: true,
        type: 'fallback',
        stats,
        isRedisAvailable: this.isRedisAvailable,
      };
    } catch (error) {
      console.error('Fallback cache STATS error:', error);
      return { connected: false, error: error.message };
    }
  }

  /**
   * Health check
   */
  async ping(): Promise<boolean> {
    try {
      // Simple test operation
      const testKey = '__ping_test__';
      this.cache.set(testKey, 'pong', 1);
      const result = this.cache.get(testKey);
      this.cache.del(testKey);
      return result === 'pong';
    } catch (error) {
      console.error('Fallback cache PING error:', error);
      return false;
    }
  }

  /**
   * Gracefully close connection
   */
  async disconnect(): Promise<void> {
    try {
      this.cache.close();
    } catch (error) {
      console.error('Fallback cache disconnect error:', error);
    }
  }
}

// Export singleton instance
export const fallbackCache = new FallbackCacheManager();
