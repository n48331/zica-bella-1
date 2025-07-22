// Product cache management utilities
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check cache validity
export const isCacheValid = (timestamp: number) => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Helper function to get cache key
export const getCacheKey = (params: URLSearchParams) => {
  return `products_${params.toString()}`;
};

// Helper function to clear all cache
export const clearCache = () => {
  cache.clear();
  console.log('Product cache cleared');
};

// Helper function to clear cache for specific patterns
export const clearCacheForPattern = (pattern: string) => {
  for (const [key] of cache.entries()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
  console.log(`Cache cleared for pattern: ${pattern}`);
};

// Helper function to get cache
export const getCache = () => cache;

// Helper function to set cache
export const setCache = (key: string, data: any) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

// Helper function to get cached data
export const getCachedData = (key: string) => {
  return cache.get(key);
}; 