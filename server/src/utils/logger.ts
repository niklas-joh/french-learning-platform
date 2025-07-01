// server/src/utils/logger.ts

/**
 * @interface ILogger
 * @description Defines a simple interface for a logger.
 * @todo Replace with a full-featured structured logger like Pino (Future Consideration #16).
 */
export interface ILogger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

/**
 * Creates a basic logger instance that prefixes messages.
 * @param context - The context name to prefix logs with (e.g., 'AIOrchestrator').
 * @returns An ILogger instance.
 */
export const createLogger = (context: string): ILogger => ({
  info: (message: string, ...args: any[]) => console.log(`[INFO] [${context}] ${message}`, ...args),
  warn: (message: string, ...args: any[]) => console.warn(`[WARN] [${context}] ${message}`, ...args),
  error: (message: string, ...args: any[]) => console.error(`[ERROR] [${context}] ${message}`, ...args),
  debug: (message: string, ...args: any[]) => console.debug(`[DEBUG] [${context}] ${message}`, ...args),
});
