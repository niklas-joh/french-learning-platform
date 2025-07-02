/**
 * @file ILogger.ts
 * @description Defines a generic logger interface to support structured logging.
 *
 * This abstraction allows for different logging implementations (e.g., console, Pino, Winston)
 * to be used without changing the application code that uses the logger.
 *
 * @see Future Implementation #16 - Implement Structured Logging
 */

export interface ILogger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}
