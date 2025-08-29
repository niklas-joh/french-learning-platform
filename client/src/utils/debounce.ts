/**
 * Debounce utility function for performance optimization
 * 
 * Creates a debounced function that delays invoking func until after delay 
 * milliseconds have elapsed since the last time the debounced function was invoked.
 * This is particularly useful for network operations and event handlers that might
 * be called frequently.
 * 
 * Performance considerations:
 * - Prevents excessive API calls during unstable network conditions
 * - Reduces server load from repeated connectivity tests
 * - Improves user experience by avoiding UI flicker during rapid state changes
 * 
 * @template T - Function type to be debounced
 * @param func - The function to debounce
 * @param delay - The number of milliseconds to delay
 * @returns A new debounced function
 * 
 * @example
 * ```typescript
 * const debouncedSave = debounce(saveToServer, 1000);
 * // Will only call saveToServer 1 second after the last invocation
 * ```
 * 
 * @author AI Development Team
 * @since 2025-08-29
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function debounced(...args: Parameters<T>) {
    // Clear any existing timeout to reset the delay
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout to call the function after the specified delay
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Advanced debounce with immediate execution option
 * 
 * Enhanced version that allows for immediate execution on first call,
 * then debounces subsequent calls.
 * 
 * @template T - Function type to be debounced
 * @param func - The function to debounce
 * @param delay - The number of milliseconds to delay
 * @param immediate - If true, trigger the function immediately on first call
 * @returns A new debounced function
 * 
 * @example
 * ```typescript
 * const debouncedSearch = debounceImmediate(search, 300, true);
 * // First call executes immediately, subsequent calls debounced
 * ```
 */
export function debounceImmediate<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function debounced(...args: Parameters<T>) {
    const callNow = immediate && !timeoutId;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) func(...args);
    }, delay);

    if (callNow) {
      func(...args);
    }
  };
}
