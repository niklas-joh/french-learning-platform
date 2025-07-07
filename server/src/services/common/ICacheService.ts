/**
 * @interface ICacheService
 * @description Defines the contract for a caching service.
 * This allows for dependency inversion, enabling consumers to depend on this
 * abstraction rather than a concrete implementation like RedisCacheService.
 * It facilitates easier testing and swapping of cache providers in the future.
 */
export interface ICacheService {
  /**
   * Retrieves an item from the cache.
   * @template T The expected type of the cached item.
   * @param {string} key The key of the item to retrieve.
   * @returns {Promise<T | null>} The cached item, or null if not found or an error occurs.
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Stores an item in the cache.
   * @template T The type of the item to store.
   * @param {string} key The key to store the item under.
   * @param {T} value The item to store.
   * @param {number} ttlSeconds The time-to-live for the cached item in seconds.
   * @returns {Promise<void>}
   */
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;

  /**
   * Deletes an item from the cache.
   * @param {string} key The key of the item to delete.
   * @returns {Promise<void>}
   */
  del(key: string): Promise<void>;

  /**
   * Clears multiple items from the cache based on a pattern.
   * @param {string} [pattern] The pattern to match keys against (e.g., 'assessment:*').
   * @returns {Promise<void>}
   */
  clear(pattern?: string): Promise<void>;
}
