/**
 * @file ICacheService.ts
 * @description Defines the interface for a generic caching service.
 *
 * This interface abstracts the underlying caching mechanism (e.g., Redis, in-memory),
 * allowing different implementations to be used interchangeably throughout the application.
 * It adheres to the Dependency Inversion Principle.
 *
 * @see Future Implementation #14 - Abstract Service Dependencies with Interfaces
 * @see Future Implementation #22 - Abstract Service Dependencies with Interfaces
 */

export interface ICacheService {
  /**
   * Retrieves an item from the cache.
   * @param key The key of the item to retrieve.
   * @returns A promise that resolves to the cached item, or null if the item is not found.
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Stores an item in the cache.
   * @param key The key to store the item under.
   * @param value The item to store.
   * @param ttlSeconds The time-to-live for the item in seconds (optional).
   * @returns A promise that resolves when the item has been stored.
   */
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;

  /**
   * Deletes an item from the cache.
   * @param key The key of the item to delete.
   * @returns A promise that resolves when the item has been deleted.
   */
  delete(key: string): Promise<void>;

  /**
   * Clears the entire cache.
   * @returns A promise that resolves when the cache has been cleared.
   */
  clear(): Promise<void>;
}
