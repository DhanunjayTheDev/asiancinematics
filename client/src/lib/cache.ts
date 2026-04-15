// Simple client-side cache manager
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();

  /**
   * Get from cache if valid, otherwise return null
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cache with TTL
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Check if cache exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get pending request or null if not found
   */
  getPendingRequest<T>(key: string): Promise<T> | null {
    return this.pendingRequests.get(key) || null;
  }

  /**
   * Set pending request
   */
  setPendingRequest<T>(key: string, promise: Promise<T>): void {
    this.pendingRequests.set(key, promise);
  }

  /**
   * Clear pending request
   */
  clearPendingRequest(key: string): void {
    this.pendingRequests.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size for debugging
   */
  size(): number {
    return this.cache.size;
  }
}

export const cacheManager = new CacheManager();

/**
 * Hook wrapper for cached API calls
 */
export function useCachedRequest<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
): () => Promise<T> {
  return async () => {
    // Check if data exists in cache
    const cached = cacheManager.get<T>(key);
    if (cached) {
      return cached;
    }

    // Check if request is already pending
    const pending = cacheManager.getPendingRequest<T>(key);
    if (pending) {
      return pending;
    }

    // Make new request
    const promise = fetchFn()
      .then((data) => {
        cacheManager.set(key, data, ttl);
        cacheManager.clearPendingRequest(key);
        return data;
      })
      .catch((error) => {
        cacheManager.clearPendingRequest(key);
        throw error;
      });

    cacheManager.setPendingRequest(key, promise);
    return promise;
  };
}
