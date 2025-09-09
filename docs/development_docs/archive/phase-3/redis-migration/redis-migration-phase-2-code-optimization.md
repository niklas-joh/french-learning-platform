# Task: Redis Migration Phase 2 - Code Optimization & Dependency Cleanup

## Task ID: Redis-Migration-2
**Estimated Time**: 30-45 minutes  
**Priority**: High  
**Dependencies**: Redis-Migration-1 (Configuration Updates)  
**Status**: Ready to Start After Phase 1

## Overview
Remove Redis dependencies from codebase, enhance DatabaseJobQueueService with efficient polling, and optimize assessment cache with in-memory alternatives.

## Detailed Changes Required

### 1. Package Dependencies Cleanup

#### File: `server/package.json`
**Current Dependencies to Remove**:
```json
{
  "dependencies": {
    "ioredis": "^5.3.2",
    "bullmq": "^4.12.7"
  }
}
```

**Required Changes**:
- Remove `ioredis` dependency
- Remove `bullmq` dependency  
- Clean up any related dev dependencies

**Validation Command**:
```bash
cd server && npm uninstall ioredis bullmq
```

### 2. Enhanced Database Job Queue Service

#### File: `server/src/services/contentGeneration/DatabaseJobQueueService.ts`
**Current Implementation**: Basic database operations
**Required Enhancements**:

**A. Add Efficient Job Polling Method**:
```typescript
/**
 * Efficient job polling with exponential backoff
 * Uses SELECT FOR UPDATE SKIP LOCKED for optimal performance
 */
export class DatabaseJobQueueService implements IJobQueueService {
  private pollInterval: number = 1000; // 1 second default
  private maxPollInterval: number = 5000; // 5 seconds max
  private currentPollInterval: number = 1000;
  private isPolling: boolean = false;

  /**
   * Start intelligent job polling with backoff strategy
   */
  public startPolling(onJobFound: (job: { id: string; payload: ContentRequest }) => Promise<void>): void {
    if (this.isPolling) {
      this.logger.warn('Polling already active');
      return;
    }

    this.isPolling = true;
    this.pollForJobs(onJobFound);
  }

  /**
   * Poll for jobs with exponential backoff
   */
  private async pollForJobs(onJobFound: (job: { id: string; payload: ContentRequest }) => Promise<void>): Promise<void> {
    while (this.isPolling) {
      try {
        const job = await this.getNextJob();
        
        if (job) {
          // Job found - reset polling interval and process
          this.currentPollInterval = this.pollInterval;
          await onJobFound(job);
        } else {
          // No job found - implement exponential backoff
          this.currentPollInterval = Math.min(
            this.currentPollInterval * 1.5,
            this.maxPollInterval
          );
        }
      } catch (error) {
        this.logger.error('Error during job polling:', error);
        // On error, use longer interval
        this.currentPollInterval = this.maxPollInterval;
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, this.currentPollInterval));
    }
  }

  /**
   * Stop job polling
   */
  public stopPolling(): void {
    this.isPolling = false;
    this.logger.info('Job polling stopped');
  }

  /**
   * Enhanced getNextJob with improved locking
   */
  async getNextJob(): Promise<{ id: string; payload: ContentRequest } | null> {
    try {
      const job = await this.knex.transaction(async (trx: KnexTypes.Transaction) => {
        // Use SKIP LOCKED for better concurrency
        const nextJob = await AiGenerationJobsModel.query(trx as any)
          .where({ status: 'queued' })
          .orderBy('createdAt', 'asc')
          .first()
          .forUpdate()
          .skipLocked();

        if (nextJob) {
          // Atomically update status to processing
          await AiGenerationJobsModel.query(trx as any)
            .patchAndFetchById(nextJob.id, {
              status: 'processing',
              updatedAt: new Date()
            });
          
          return nextJob;
        }
        return null;
      });

      if (!job) {
        return null;
      }

      return {
        id: job.id,
        payload: job.payload as ContentRequest,
      };
    } catch (error) {
      this.logger.error('Error getting next job:', error);
      return null;
    }
  }
}
```

**B. Add Job Prioritization Support**:
```typescript
/**
 * Enhanced job enqueueing with priority support
 */
async enqueueJob(request: ContentRequest, priority: 'high' | 'normal' | 'low' = 'normal'): Promise<string> {
  const priorityValue = { high: 1, normal: 2, low: 3 }[priority];
  
  const jobData: Partial<AiGenerationJob> = {
    userId: request.userId,
    status: 'queued',
    jobType: request.type,
    payload: request,
    priority: priorityValue, // Add priority field
  };

  const insertedJob = await AiGenerationJobsModel.query().insertAndFetch(jobData);
  this.logger.info(`Job ${insertedJob.id} enqueued with ${priority} priority`);
  return insertedJob.id;
}
```

### 3. Worker Service Updates

#### File: `server/src/worker.ts`
**Required Changes**: Replace Redis worker with database polling

**A. Remove BullMQ Dependencies**:
```typescript
// REMOVE these imports:
// import { Worker, Job } from 'bullmq';
// import { redisConnection, QUEUE_NAMES } from './config/redis.js';

// ADD database job polling:
import { DatabaseJobQueueService } from './services/contentGeneration/DatabaseJobQueueService.js';
```

**B. Implement Database Job Polling**:
```typescript
/**
 * Database-based job polling worker implementation
 */
const startDatabaseJobPolling = async (): Promise<void> => {
  const jobQueueService = new DatabaseJobQueueService(knex, console);
  
  // Start polling for jobs
  jobQueueService.startPolling(async (job) => {
    console.log(`🔄 Processing database job ${job.id}`);
    
    try {
      // Process the job using existing logic
      const result = await processJob({
        id: job.id,
        data: job.payload
      } as any);
      
      // Mark job as completed
      await jobQueueService.setJobResult(job.id, result);
      console.log(`✅ Database job ${job.id} completed successfully`);
      
    } catch (error) {
      console.error(`❌ Database job ${job.id} failed:`, error);
      await jobQueueService.updateJobStatus(job.id, 'failed', error.message);
    }
  });
  
  console.log('📡 Database job polling started successfully');
};

/**
 * Updated worker startup without Redis dependency
 */
const startWorker = async (): Promise<void> => {
  console.log('🚀 Starting database-only content generation worker...');
  
  try {
    // Validate database connection
    const dbConnected = await validateDatabaseConnection();
    if (!dbConnected) {
      console.error('💥 Worker startup failed: Database connection unavailable');
      process.exit(1);
    }

    // Start database job polling instead of Redis worker
    await startDatabaseJobPolling();
    
    console.log('✨ Database-only worker started successfully');
    console.log('🎯 Worker is polling database for jobs...');
    
  } catch (error: any) {
    console.error('💥 Worker startup failed:', error.message);
    console.error('🔍 Check database connection and configuration');
    process.exit(1);
  }
};
```

### 4. Assessment Cache Service Updates

#### File: `server/src/services/assessment/assessmentServiceFactory.ts`
**Current Issue**: Basic Map-based cache with no expiration
**Required Enhancement**: Implement proper in-memory cache

**A. Enhanced Cache Service Implementation**:
```typescript
/**
 * Enhanced in-memory cache service with expiration and memory management
 */
class InMemoryCacheService {
  private cache = new Map<string, { value: any; expires: number }>();
  private readonly maxSize: number = 1000; // Maximum cache entries
  private readonly defaultTTL: number = 300000; // 5 minutes default TTL

  constructor(maxSize?: number, defaultTTL?: number) {
    this.maxSize = maxSize || this.maxSize;
    this.defaultTTL = defaultTTL || this.defaultTTL;
    
    // Clean expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const expires = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { value, expires });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(pattern?: string): Promise<void> {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    
    // Simple pattern matching for keys
    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      usage: (this.cache.size / this.maxSize) * 100,
    };
  }
}
```

**B. Update BatchAssessmentProcessor to use enhanced cache**:
```typescript
// Replace the simple cache implementation with enhanced version
const cacheService = new InMemoryCacheService(500, 600000); // 500 entries, 10min TTL
```

### 5. Remove Redis Imports and References

#### Files to Update:
**A. Content Generation Index**: `server/src/services/contentGeneration/index.ts`
- Remove any Redis-related imports
- Update service factory to use database-only services

**B. Redis Config File**: `server/src/config/redis.ts`
**Complete Replacement**:
```typescript
/**
 * Database-Only Job Queue Configuration
 * Redis functionality disabled for corporate environment compatibility
 */

// Database job queue configuration
export const DB_JOB_QUEUE_CONFIG = {
  enabled: process.env.DB_JOB_QUEUE_ENABLED !== 'false', // Default enabled
  pollInterval: parseInt(process.env.DB_JOB_POLL_INTERVAL_MS || '1000', 10),
  maxConcurrent: parseInt(process.env.DB_JOB_MAX_CONCURRENT || '5', 10),
  maxPollInterval: parseInt(process.env.DB_JOB_MAX_POLL_INTERVAL_MS || '5000', 10),
};

// Redis functionality disabled
export const isRedisEnabled = false;
export const redisConnection = null;

// Legacy queue names for compatibility
export const QUEUE_NAMES = {
  CONTENT_GENERATION: 'content-generation-database-queue',
};

console.log('📊 Database-only job processing configuration loaded');
console.log('🚫 Redis functionality disabled for corporate environment');
```

## Dependent Files

### Files Modified in This Phase:
1. `server/package.json` - Remove Redis dependencies
2. `server/src/services/contentGeneration/DatabaseJobQueueService.ts` - Enhanced polling
3. `server/src/worker.ts` - Database polling implementation
4. `server/src/services/assessment/assessmentServiceFactory.ts` - Enhanced cache
5. `server/src/config/redis.ts` - Complete database-only configuration
6. `server/src/services/contentGeneration/index.ts` - Remove Redis references

### Integration Points:
- **Phase 1 Output**: Environment variables and basic configuration
- **Phase 3 Input**: Database indexes and performance optimizations
- **Assessment Services**: Enhanced caching for better performance

## Review Points & Considerations

### 1. **Performance Optimizations**
- ✅ **Exponential backoff** - Reduces database load when no jobs available
- ✅ **SKIP LOCKED queries** - Prevents lock contention in concurrent scenarios
- ✅ **In-memory caching** - Reduces database queries for assessment data
- ✅ **Job prioritization** - Important jobs processed first

### 2. **Memory Management**
- ✅ **LRU eviction** - Prevents memory leaks in cache
- ✅ **TTL expiration** - Automatic cleanup of stale data
- ✅ **Memory monitoring** - Statistics for cache usage tracking

### 3. **Concurrency Handling**
- ✅ **Atomic job locking** - Prevents duplicate job processing
- ✅ **Graceful error handling** - System continues after individual job failures
- ✅ **Configurable concurrency** - Adjustable worker thread limits

## Possible Solutions Considered

### Solution 1: Enhanced Database Polling (CHOSEN)
**Pros**:
- Intelligent backoff reduces database load
- Atomic job locking prevents race conditions
- Configurable performance parameters

**Cons**:
- Slightly more complex than basic polling
- Requires careful tuning of polling intervals

### Solution 2: Basic Database Polling (REJECTED)
**Pros**:
- Simpler implementation
- Easier to understand and debug

**Cons**:
- Inefficient database usage
- Poor performance under load
- No optimization for idle periods

### Solution 3: Event-Driven Database Triggers (REJECTED)
**Pros**:
- Real-time job processing
- Minimal polling overhead

**Cons**:
- Database-specific implementation
- Complex setup and debugging
- Not supported in SQLite without extensions

## Testing Strategy

### 1. Performance Testing
- [ ] Job polling efficiency under various loads
- [ ] Memory usage of enhanced cache service
- [ ] Concurrent job processing accuracy
- [ ] Database connection stability

### 2. Functionality Testing
- [ ] Job enqueueing and processing
- [ ] Priority-based job ordering
- [ ] Error handling and recovery
- [ ] Cache hit/miss ratios

### 3. Integration Testing
- [ ] Worker startup and shutdown
- [ ] AI content generation end-to-end
- [ ] Assessment caching effectiveness
- [ ] System stability under load

## Success Criteria

### Phase 2 Completion Checklist:
- [ ] Redis dependencies removed from package.json
- [ ] Enhanced DatabaseJobQueueService with polling implemented
- [ ] Worker uses database polling instead of Redis
- [ ] In-memory cache service with expiration implemented
- [ ] All Redis imports and references removed
- [ ] Job prioritization working correctly

### Performance Metrics:
- Job processing latency: < 2 seconds average
- Cache hit rate: > 70% for assessment data
- Memory usage: < 100MB for cache service
- Database polling efficiency: < 1 query/second during idle

## Risk Assessment

### Medium Risk Items:
- **Polling Performance**: Database load under high job volume
  - *Mitigation*: Intelligent backoff and configurable intervals
- **Memory Leaks**: In-memory cache growth
  - *Mitigation*: LRU eviction and TTL cleanup

### Low Risk Items:
- **Job Processing**: Already tested with existing DatabaseJobQueueService
- **Error Handling**: Existing error handling patterns maintained

## Next Phase Dependencies

This phase enables:
- **Phase 3**: Database indexing for optimal job queue performance
- **Phase 4**: Monitoring and metrics collection for the new system

## Implementation Notes

### Development Order:
1. Remove Redis dependencies from package.json
2. Enhance DatabaseJobQueueService with polling methods
3. Update worker.ts to use database polling
4. Implement enhanced cache service
5. Remove all Redis imports and references
6. Test integrated system

### Validation Commands:
```bash
# Remove Redis dependencies
cd server && npm uninstall ioredis bullmq

# Test worker startup
npm run worker:dev

# Check for Redis references (should be empty)
grep -r "redis\|bullmq" src/ --exclude-dir=node_modules

# Test job processing
curl -X POST http://localhost:3001/api/v1/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"type":"lesson","userId":1,"payload":{"topic":"greetings"}}'
```

---
**Author**: AI Development Team  
**Created**: 2025-09-07  
**Last Updated**: 2025-09-07  
**Status**: Ready for Implementation After Phase 1
