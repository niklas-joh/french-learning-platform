/**
 * @file server/src/config/database-job-queue.ts
 * @description Database-Only Job Queue Configuration
 * 
 * This configuration module provides validated settings for database-only job processing,
 * replacing Redis/BullMQ dependencies with a pure database approach. Designed for 
 * corporate environments where external service dependencies are restricted.
 * 
 * @author AI Content Generation System
 * @version 1.0.0 - Database-only implementation
 * @created 2025-01-08
 */

/**
 * Database job queue configuration with validation
 * Centralizes all job processing configuration to follow DRY principles
 * and ensure consistent behavior across worker processes.
 */
export const DB_JOB_QUEUE_CONFIG = {
  /** Always enabled for database-only approach */
  enabled: true,
  
  /** 
   * Polling interval in milliseconds 
   * Minimum 100ms to prevent excessive database load
   */
  pollInterval: validatePositiveInteger(
    process.env.DB_JOB_POLL_INTERVAL_MS || '1000',
    'DB_JOB_POLL_INTERVAL_MS',
    100,
    60000 // Max 60 seconds
  ),
  
  /** 
   * Maximum concurrent jobs per worker process
   * Balances throughput with resource usage
   */
  maxConcurrent: validatePositiveInteger(
    process.env.DB_JOB_MAX_CONCURRENT || '5',
    'DB_JOB_MAX_CONCURRENT', 
    1,
    50 // Reasonable upper limit
  ),
  
  /** 
   * Maximum retry attempts for failed jobs
   * Prevents infinite retry loops while allowing recovery
   */
  maxRetries: validatePositiveInteger(
    process.env.DB_JOB_MAX_RETRIES || '3',
    'DB_JOB_MAX_RETRIES',
    1,
    10
  ),
  
  /** 
   * Graceful shutdown timeout in milliseconds
   * Maximum time to wait for active jobs to complete during shutdown
   */
  shutdownTimeout: validatePositiveInteger(
    process.env.DB_JOB_SHUTDOWN_TIMEOUT_MS || '30000',
    'DB_JOB_SHUTDOWN_TIMEOUT_MS',
    5000,
    300000 // Max 5 minutes
  ),
} as const;

/**
 * Validates and parses environment variable as positive integer
 * 
 * @param value - Raw environment variable value
 * @param envVarName - Name of environment variable for error messages
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @returns Validated integer value
 * @throws {Error} If value is invalid or out of range
 * 
 * @example
 * ```typescript
 * const pollInterval = validatePositiveInteger('1000', 'POLL_INTERVAL', 100, 60000);
 * // Returns: 1000
 * ```
 */
function validatePositiveInteger(
  value: string,
  envVarName: string,
  min: number,
  max: number
): number {
  const parsed = parseInt(value, 10);
  
  if (isNaN(parsed)) {
    throw new Error(
      `Configuration error: ${envVarName} must be a valid integer, got "${value}"`
    );
  }
  
  if (parsed < min || parsed > max) {
    throw new Error(
      `Configuration error: ${envVarName} must be between ${min} and ${max}, got ${parsed}`
    );
  }
  
  return parsed;
}

/**
 * Database job queue status enum
 * Matches the database schema for ai_generation_jobs table
 */
export const JOB_STATUS = {
  QUEUED: 'queued',
  PROCESSING: 'processing', 
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

/**
 * Type for job status values
 */
export type JobStatus = typeof JOB_STATUS[keyof typeof JOB_STATUS];

/**
 * Configuration summary for logging and debugging
 * Provides human-readable configuration overview
 */
export const getConfigSummary = (): string => {
  const { pollInterval, maxConcurrent, maxRetries, shutdownTimeout } = DB_JOB_QUEUE_CONFIG;
  
  return [
    '📊 Database Job Queue Configuration:',
    `   • Poll interval: ${pollInterval}ms`,
    `   • Max concurrent jobs: ${maxConcurrent}`,
    `   • Max retry attempts: ${maxRetries}`,
    `   • Shutdown timeout: ${shutdownTimeout}ms`,
    '   • External dependencies: None (database-only)',
  ].join('\n');
};

// Log configuration on module load for debugging
console.log(getConfigSummary());

/**
 * Validates that all required environment variables are properly set
 * Should be called during application startup to fail fast on configuration errors
 * 
 * @throws {Error} If any configuration validation fails
 */
export const validateConfiguration = (): void => {
  try {
    // Configuration validation happens during constant initialization
    // If we reach here, all validations passed
    console.log('✅ Database job queue configuration validated successfully');
  } catch (error) {
    console.error('❌ Database job queue configuration validation failed:', error);
    throw error;
  }
};
