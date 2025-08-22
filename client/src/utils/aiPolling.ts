/**
 * AI Polling Manager - Centralized Resource Management
 * 
 * This module provides a sophisticated polling system for AI job status tracking
 * with advanced performance optimizations, circuit breaker patterns, and
 * intelligent resource management.
 * 
 * Key Features:
 * - Maximum 3 concurrent polling operations with queuing
 * - Exponential backoff with adaptive intervals based on job types
 * - Circuit breaker pattern for API resilience
 * - Request deduplication and batching for efficiency
 * - Memory-efficient cleanup using WeakRef and FinalizationRegistry
 * - Comprehensive metrics and monitoring
 * 
 * @author AI Development Team
 * @since 2025-08-22
 */

import { AIGenerationJob, PollingOptions, PollingManagerStatus } from '../types/AIDashboard.js';

/**
 * Circuit breaker states for API resilience
 */
enum CircuitBreakerState {
  CLOSED = 'closed',     // Normal operation
  OPEN = 'open',         // Circuit open, failing fast
  HALF_OPEN = 'half_open' // Testing if service has recovered
}

/**
 * Internal polling operation tracker
 */
interface PollingOperation {
  jobId: string;
  onUpdate: (job: AIGenerationJob) => void;
  onComplete: (job: AIGenerationJob) => void;
  onError: (error: Error) => void;
  options: Required<PollingOptions>;
  currentInterval: number;
  retryCount: number;
  startTime: number;
  lastPollTime: number;
  abortController: AbortController;
}

/**
 * Request deduplication entry
 */
interface DedupEntry {
  promise: Promise<AIGenerationJob>;
  subscribers: Array<(job: AIGenerationJob) => void>;
  timestamp: number;
}

/**
 * Circuit breaker configuration
 */
interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number;
  maxHalfOpenRequests: number;
}

/**
 * Performance metrics tracker
 */
interface PerformanceMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  circuitBreakerTrips: number;
  dedupCacheHits: number;
  memoryUsage: number;
}

/**
 * Centralized AI Job Polling Manager
 * 
 * Manages multiple concurrent polling operations with advanced optimizations:
 * - Resource limiting and queuing
 * - Circuit breaker for API resilience
 * - Request deduplication
 * - Adaptive polling intervals
 * - Memory-efficient cleanup
 */
export class PollingManager {
  private activePolls = new Map<string, PollingOperation>();
  private pollingTimeouts = new Map<string, NodeJS.Timeout>();
  private waitingQueue: Array<() => void> = [];
  private readonly maxConcurrent = 3;
  
  // Circuit breaker implementation
  private circuitBreakerState = CircuitBreakerState.CLOSED;
  private circuitBreakerConfig: CircuitBreakerConfig = {
    failureThreshold: 5,
    recoveryTimeout: 30000, // 30 seconds
    maxHalfOpenRequests: 3
  };
  private failureCount = 0;
  private lastFailureTime = 0;
  private halfOpenRequests = 0;
  
  // Request deduplication cache
  private dedupCache = new Map<string, DedupEntry>();
  private readonly dedupCacheTTL = 5000; // 5 seconds
  
  // Performance metrics
  private metrics: PerformanceMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    circuitBreakerTrips: 0,
    dedupCacheHits: 0,
    memoryUsage: 0
  };
  
  // Memory management
  private memoryCleanupRegistry?: FinalizationRegistry<string>;
  private memoryRefs = new Map<string, WeakRef<PollingOperation>>();
  
  /**
   * Initialize the polling manager with memory management
   */
  constructor() {
    // Set up memory cleanup registry if supported
    if (typeof FinalizationRegistry !== 'undefined') {
      this.memoryCleanupRegistry = new FinalizationRegistry((jobId: string) => {
        this.cleanupPollingOperation(jobId);
      });
    }
    
    // Periodic cleanup of stale cache entries
    setInterval(() => {
      this.cleanupStaleCache();
      this.updateMemoryMetrics();
    }, 10000); // Every 10 seconds
  }
  
  /**
   * Start polling for a job with advanced optimizations
   * 
   * @param jobId - Unique job identifier
   * @param onUpdate - Callback for job status updates
   * @param onComplete - Callback for job completion
   * @param onError - Callback for errors
   * @param options - Polling configuration options
   */
  async startPolling(
    jobId: string,
    onUpdate: (job: AIGenerationJob) => void,
    onComplete: (job: AIGenerationJob) => void,
    onError: (error: Error) => void,
    options: PollingOptions = {}
  ): Promise<void> {
    // Check circuit breaker state
    if (this.circuitBreakerState === CircuitBreakerState.OPEN) {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure < this.circuitBreakerConfig.recoveryTimeout) {
        onError(new Error('Circuit breaker is open - service temporarily unavailable'));
        return;
      } else {
        // Transition to half-open state
        this.circuitBreakerState = CircuitBreakerState.HALF_OPEN;
        this.halfOpenRequests = 0;
      }
    }
    
    // Check for existing polling operation
    if (this.activePolls.has(jobId)) {
      console.warn(`Polling already active for job ${jobId}`);
      return;
    }
    
    // Wait for available slot if at max concurrent
    if (this.activePolls.size >= this.maxConcurrent) {
      await this.waitForSlot();
    }
    
    // Create polling operation with adaptive defaults
    const adaptiveOptions = this.getAdaptiveOptions(options);
    const operation: PollingOperation = {
      jobId,
      onUpdate,
      onComplete,
      onError,
      options: adaptiveOptions,
      currentInterval: adaptiveOptions.initialInterval,
      retryCount: 0,
      startTime: Date.now(),
      lastPollTime: 0,
      abortController: new AbortController()
    };
    
    this.activePolls.set(jobId, operation);
    
    // Set up memory management
    if (this.memoryCleanupRegistry) {
      this.memoryRefs.set(jobId, new WeakRef(operation));
      this.memoryCleanupRegistry.register(operation, jobId);
    }
    
    // Start polling with deduplication
    this.pollWithDeduplication(operation);
  }
  
  /**
   * Stop polling for a specific job
   * 
   * @param jobId - Job identifier to stop polling
   */
  stopPolling(jobId: string): void {
    const operation = this.activePolls.get(jobId);
    if (operation) {
      operation.abortController.abort();
      this.cleanupPollingOperation(jobId);
    }
    
    // Process waiting queue
    if (this.waitingQueue.length > 0) {
      const nextCallback = this.waitingQueue.shift();
      if (nextCallback) {
        // Use setTimeout to avoid stack overflow with rapid queue processing
        setTimeout(nextCallback, 0);
      }
    }
  }
  
  /**
   * Cleanup all polling operations and resources
   */
  cleanup(): void {
    // Abort all active operations
    for (const [jobId, operation] of this.activePolls) {
      operation.abortController.abort();
      this.cleanupPollingOperation(jobId);
    }
    
    // Clear all timeouts
    for (const timeout of this.pollingTimeouts.values()) {
      clearTimeout(timeout);
    }
    
    // Clear all data structures
    this.activePolls.clear();
    this.pollingTimeouts.clear();
    this.waitingQueue.length = 0;
    this.dedupCache.clear();
    this.memoryRefs.clear();
    
    // Reset circuit breaker
    this.circuitBreakerState = CircuitBreakerState.CLOSED;
    this.failureCount = 0;
    this.halfOpenRequests = 0;
  }
  
  /**
   * Get current polling manager status
   */
  getStatus(): PollingManagerStatus {
    return {
      activePolls: this.activePolls.size,
      maxConcurrent: this.maxConcurrent,
      waitingQueue: this.waitingQueue.length,
      totalProcessed: this.metrics.totalRequests,
      successRate: this.metrics.totalRequests > 0 
        ? this.metrics.successfulRequests / this.metrics.totalRequests 
        : 0
    };
  }
  
  /**
   * Get detailed performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
  
  /**
   * Reset circuit breaker (for manual recovery)
   */
  resetCircuitBreaker(): void {
    this.circuitBreakerState = CircuitBreakerState.CLOSED;
    this.failureCount = 0;
    this.halfOpenRequests = 0;
    console.log('Circuit breaker manually reset');
  }
  
  /**
   * Poll with request deduplication for efficiency
   */
  private async pollWithDeduplication(operation: PollingOperation): Promise<void> {
    const { jobId } = operation;
    
    // Check deduplication cache
    const cacheKey = `job_status_${jobId}`;
    const cached = this.dedupCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.dedupCacheTTL) {
      // Use cached promise
      this.metrics.dedupCacheHits++;
      try {
        const job = await cached.promise;
        this.handleJobStatusUpdate(operation, job);
      } catch (error) {
        this.handlePollingError(operation, error as Error);
      }
      return;
    }
    
    // Create new request
    const requestPromise = this.makeJobStatusRequest(jobId, operation.abortController.signal);
    
    // Cache the promise for deduplication
    this.dedupCache.set(cacheKey, {
      promise: requestPromise,
      subscribers: [job => this.handleJobStatusUpdate(operation, job)],
      timestamp: Date.now()
    });
    
    try {
      const job = await requestPromise;
      this.handleJobStatusUpdate(operation, job);
    } catch (error) {
      this.handlePollingError(operation, error as Error);
    }
  }
  
  /**
   * Make job status API request with circuit breaker protection
   */
  private async makeJobStatusRequest(jobId: string, signal: AbortSignal): Promise<AIGenerationJob> {
    const startTime = Date.now();
    this.metrics.totalRequests++;
    
    // Check circuit breaker
    if (this.circuitBreakerState === CircuitBreakerState.HALF_OPEN) {
      this.halfOpenRequests++;
      if (this.halfOpenRequests > this.circuitBreakerConfig.maxHalfOpenRequests) {
        throw new Error('Circuit breaker: Too many half-open requests');
      }
    }
    
    try {
      // Import api service dynamically to avoid circular dependencies
      const { default: api } = await import('../services/api.js');
      
      const response = await api.get(`/ai/generate/status/${jobId}`, { signal });
      
      // Update metrics on success
      const responseTime = Date.now() - startTime;
      this.updateResponseTimeMetrics(responseTime);
      this.metrics.successfulRequests++;
      
      // Circuit breaker success handling
      if (this.circuitBreakerState === CircuitBreakerState.HALF_OPEN) {
        this.circuitBreakerState = CircuitBreakerState.CLOSED;
        this.failureCount = 0;
        console.log('Circuit breaker closed - service recovered');
      }
      
      return response.data;
    } catch (error) {
      // Update failure metrics
      this.metrics.failedRequests++;
      this.handleCircuitBreakerFailure();
      throw error;
    }
  }
  
  /**
   * Handle job status update with state management
   */
  private handleJobStatusUpdate(operation: PollingOperation, job: AIGenerationJob): void {
    operation.lastPollTime = Date.now();
    operation.onUpdate(job);
    
    if (job.status === 'completed') {
      operation.onComplete(job);
      this.stopPolling(operation.jobId);
      return;
    }
    
    if (job.status === 'failed' || job.status === 'cancelled') {
      operation.onError(new Error(job.error || `Job ${job.status}`));
      this.stopPolling(operation.jobId);
      return;
    }
    
    // Schedule next poll with adaptive interval
    this.scheduleNextPoll(operation);
  }
  
  /**
   * Handle polling errors with retry logic
   */
  private handlePollingError(operation: PollingOperation, error: Error): void {
    operation.retryCount++;
    
    // Check if we should continue retrying
    if (operation.retryCount >= operation.options.maxRetries) {
      operation.onError(new Error(`Polling timeout - maximum retries (${operation.options.maxRetries}) exceeded`));
      this.stopPolling(operation.jobId);
      return;
    }
    
    // Check for abort signal
    if (operation.abortController.signal.aborted) {
      console.log(`Polling aborted for job ${operation.jobId}`);
      return;
    }
    
    console.warn(`Polling error for job ${operation.jobId} (attempt ${operation.retryCount}):`, error.message);
    
    // Schedule retry with exponential backoff
    this.scheduleNextPoll(operation);
  }
  
  /**
   * Schedule next polling attempt with adaptive intervals
   */
  private scheduleNextPoll(operation: PollingOperation): void {
    // Calculate adaptive interval based on job type and current state
    const baseInterval = this.getAdaptiveInterval(operation);
    operation.currentInterval = Math.min(
      baseInterval * Math.pow(operation.options.backoffMultiplier, operation.retryCount),
      operation.options.maxInterval
    );
    
    const timeoutId = setTimeout(() => {
      this.pollingTimeouts.delete(operation.jobId);
      this.pollWithDeduplication(operation);
    }, operation.currentInterval);
    
    this.pollingTimeouts.set(operation.jobId, timeoutId);
  }
  
  /**
   * Get adaptive polling interval based on job type and elapsed time
   */
  private getAdaptiveInterval(operation: PollingOperation): number {
    const { jobType } = operation.options;
    const elapsedTime = Date.now() - operation.startTime;
    
    // Job type specific intervals
    const typeMultipliers = {
      'lesson': 1.0,      // Standard interval
      'vocabulary': 0.8,   // Faster (usually quick to generate)
      'grammar': 1.2,      // Slower (more complex)
      'assessment': 1.5    // Slowest (most complex)
    };
    
    const multiplier = typeMultipliers[jobType] || 1.0;
    
    // Progressive intervals: start fast, slow down for long-running jobs
    if (elapsedTime < 30000) { // First 30 seconds
      return operation.options.initialInterval * multiplier;
    } else if (elapsedTime < 120000) { // First 2 minutes
      return operation.options.initialInterval * multiplier * 2;
    } else { // After 2 minutes
      return operation.options.initialInterval * multiplier * 3;
    }
  }
  
  /**
   * Get adaptive polling options based on job type
   */
  private getAdaptiveOptions(options: PollingOptions): Required<PollingOptions> {
    const defaults = {
      initialInterval: 1000,
      maxInterval: 30000,
      maxRetries: 30,
      backoffMultiplier: 1.5,
      jobType: 'lesson' as const,
      timeout: 300000 // 5 minutes
    };
    
    // Job type specific optimizations
    const typeDefaults = {
      'lesson': { initialInterval: 1000, maxRetries: 25 },
      'vocabulary': { initialInterval: 800, maxRetries: 20 },
      'grammar': { initialInterval: 1200, maxRetries: 30 },
      'assessment': { initialInterval: 1500, maxRetries: 35 }
    };
    
    const jobTypeDefaults = typeDefaults[options.jobType || 'lesson'] || typeDefaults.lesson;
    
    return {
      ...defaults,
      ...jobTypeDefaults,
      ...options
    };
  }
  
  /**
   * Wait for an available polling slot
   */
  private async waitForSlot(): Promise<void> {
    return new Promise((resolve) => {
      this.waitingQueue.push(resolve);
    });
  }
  
  /**
   * Cleanup polling operation and associated resources
   */
  private cleanupPollingOperation(jobId: string): void {
    // Clear timeout
    const timeoutId = this.pollingTimeouts.get(jobId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.pollingTimeouts.delete(jobId);
    }
    
    // Remove from active polls
    this.activePolls.delete(jobId);
    
    // Clean memory references
    this.memoryRefs.delete(jobId);
    
    // Clean from dedup cache
    this.dedupCache.delete(`job_status_${jobId}`);
  }
  
  /**
   * Handle circuit breaker failure logic
   */
  private handleCircuitBreakerFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.circuitBreakerConfig.failureThreshold) {
      this.circuitBreakerState = CircuitBreakerState.OPEN;
      this.metrics.circuitBreakerTrips++;
      console.warn(`Circuit breaker opened after ${this.failureCount} failures`);
    }
  }
  
  /**
   * Update response time metrics with exponential moving average
   */
  private updateResponseTimeMetrics(responseTime: number): void {
    if (this.metrics.averageResponseTime === 0) {
      this.metrics.averageResponseTime = responseTime;
    } else {
      // Exponential moving average with alpha = 0.1
      this.metrics.averageResponseTime = 
        0.9 * this.metrics.averageResponseTime + 0.1 * responseTime;
    }
  }
  
  /**
   * Clean up stale deduplication cache entries
   */
  private cleanupStaleCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.dedupCache.entries()) {
      if (now - entry.timestamp > this.dedupCacheTTL) {
        this.dedupCache.delete(key);
      }
    }
  }
  
  /**
   * Update memory usage metrics
   */
  private updateMemoryMetrics(): void {
    // Estimate memory usage based on active operations and cache size
    const operationMemory = this.activePolls.size * 1024; // ~1KB per operation
    const cacheMemory = this.dedupCache.size * 512; // ~512B per cache entry
    this.metrics.memoryUsage = operationMemory + cacheMemory;
  }
}

/**
 * Factory function to create a polling manager instance
 * Following the factory pattern from development principles
 */
export function createPollingManager(): PollingManager {
  return new PollingManager();
}

/**
 * Singleton instance for global use
 * Can be replaced with factory-created instances in tests
 */
export const pollingManager = createPollingManager();

/**
 * Cleanup on page unload for browser environments
 */
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    pollingManager.cleanup();
  });
  
  // Also cleanup on page visibility change for mobile browsers
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Optionally pause polling when page is hidden
      console.log('Page hidden - polling continues in background');
    }
  });
}

/**
 * Batch polling utility for multiple jobs
 * Efficiently manages multiple job status requests
 */
export class BatchPollingManager {
  private pollingManager: PollingManager;
  private batchJobs = new Map<string, Set<string>>();
  
  constructor(pollingManager: PollingManager) {
    this.pollingManager = pollingManager;
  }
  
  /**
   * Start polling for multiple jobs as a batch
   */
  async startBatchPolling(
    batchId: string,
    jobIds: string[],
    onBatchUpdate: (results: Map<string, AIGenerationJob>) => void,
    onBatchComplete: (results: Map<string, AIGenerationJob>) => void,
    onBatchError: (errors: Map<string, Error>) => void,
    options: PollingOptions = {}
  ): Promise<void> {
    const results = new Map<string, AIGenerationJob>();
    const errors = new Map<string, Error>();
    const jobSet = new Set(jobIds);
    
    this.batchJobs.set(batchId, jobSet);
    
    // Start polling for each job
    for (const jobId of jobIds) {
      await this.pollingManager.startPolling(
        jobId,
        (job) => {
          results.set(jobId, job);
          onBatchUpdate(new Map(results));
        },
        (job) => {
          results.set(jobId, job);
          jobSet.delete(jobId);
          
          if (jobSet.size === 0) {
            onBatchComplete(results);
            this.batchJobs.delete(batchId);
          }
        },
        (error) => {
          errors.set(jobId, error);
          jobSet.delete(jobId);
          
          if (jobSet.size === 0) {
            if (errors.size === jobIds.length) {
              onBatchError(errors);
            } else {
              onBatchComplete(results);
            }
            this.batchJobs.delete(batchId);
          }
        },
        options
      );
    }
  }
  
  /**
   * Stop batch polling
   */
  stopBatchPolling(batchId: string): void {
    const jobSet = this.batchJobs.get(batchId);
    if (jobSet) {
      for (const jobId of jobSet) {
        this.pollingManager.stopPolling(jobId);
      }
      this.batchJobs.delete(batchId);
    }
  }
}

/**
 * Create batch polling manager
 */
export function createBatchPollingManager(pollingManager?: PollingManager): BatchPollingManager {
  return new BatchPollingManager(pollingManager || createPollingManager());
}
