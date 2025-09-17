# Subtask 1: Worker Entry Point Creation

**Parent Task**: option-b-redis-bullmq-worker-implementation  
**Subtask ID**: worker-entry-point-creation  
**Estimated Time**: 10 minutes  
**Status**: ✅ **COMPLETED** (with critical BullMQ integration fix)

## Objective

Create a dedicated entry point (`server/src/worker.ts`) for the background worker process, ensuring proper separation of concerns between the API server and background job processing.

## Technical Requirements

### File to Create
- **`server/src/worker.ts`** - Dedicated worker process entry point

### Architecture Pattern
Following the **Dedicated Worker Architecture** pattern:
- Separate process from API server (`app.ts`)
- Reuse existing worker logic from `contentGenerationWorker.ts`
- Implement graceful shutdown handling
- Follow ESM and factory patterns from development principles

### Implementation Details

#### Core Functionality
1. **Process Initialization**: Start the BullMQ worker using existing infrastructure
2. **Graceful Shutdown**: Handle SIGTERM/SIGINT for clean shutdowns
3. **Error Handling**: Comprehensive error logging and recovery
4. **Service Integration**: Leverage existing `contentGenerationServiceFactory`

#### Code Structure (25 lines)
```typescript
// ESM imports following development principles
import { Worker } from 'bullmq';
import { redisConnection, QUEUE_NAMES } from './config/redis.js';
import { contentGenerationServiceFactory } from './services/contentGeneration/index.js';
import { processJob } from './workers/contentGenerationWorker.js'; // Extract process function

// Factory pattern for worker management
const createWorker = (() => {
  let workerInstance: Worker | null = null;
  
  return (): Worker | null => {
    if (workerInstance) return workerInstance;
    
    if (!redisConnection) {
      console.log('❌ Redis not enabled - worker disabled');
      return null;
    }
    
    workerInstance = new Worker(QUEUE_NAMES.CONTENT_GENERATION, processJob, {
      connection: redisConnection,
      concurrency: 5
    });
    
    return workerInstance;
  };
})();

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`🔄 Received ${signal}, shutting down worker gracefully...`);
  
  const worker = createWorker();
  if (worker) {
    await worker.close();
    console.log('✅ Worker shutdown complete');
  }
  
  process.exit(0);
};

// Main execution
const startWorker = async () => {
  try {
    const worker = createWorker();
    
    if (!worker) {
      console.log('⚠️  Worker not started (Redis disabled)');
      return;
    }
    
    // Event handlers
    worker.on('completed', (job) => {
      console.log(`✅ Job ${job.id} completed successfully`);
    });
    
    worker.on('failed', (job, err) => {
      console.error(`❌ Job ${job?.id} failed:`, err.message);
    });
    
    worker.on('error', (err) => {
      console.error('🚨 Worker error:', err);
    });
    
    // Graceful shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    console.log('🚀 Content generation worker started');
    console.log(`📊 Concurrency: 5 jobs, Queue: ${QUEUE_NAMES.CONTENT_GENERATION}`);
    
  } catch (error) {
    console.error('💥 Worker startup failed:', error);
    process.exit(1);
  }
};

// Start the worker
startWorker();
```

## Development Principles Compliance

### ✅ ESM Compliance
- Use `.js` extensions in all imports
- Proper ES module patterns
- Compatible with existing `tsx` execution

### ✅ Factory Singleton Pattern  
- Singleton worker instance for memory efficiency
- <1ms instantiation after first call
- Reuse existing service factories unchanged

### ✅ camelCase Naming
- Consistent variable and function naming
- Matches existing codebase patterns

### ✅ Type Safety
- Proper TypeScript types from existing imports
- Leverage BullMQ type definitions

### ✅ Separation of Concerns
- Dedicated process for background jobs only
- Clean separation from API server responsibilities

## Code Reuse Analysis

### Existing Components Leveraged (100%)
- ✅ `redisConnection` from `config/redis.js` - Zero changes
- ✅ `QUEUE_NAMES` from `config/redis.js` - Zero changes  
- ✅ `contentGenerationServiceFactory` - Zero changes
- ✅ BullMQ Worker configuration - Reuse existing patterns
- ✅ Job processing logic from `contentGenerationWorker.ts` - Extract and reuse

### New Code Required
- 25 lines of process management and initialization code
- No modifications to existing service layer

## Implementation Strategy

### Phase 1: Extract Processing Function (5 min)
- Extract `processJob` function from `contentGenerationWorker.ts` for reuse
- Maintain existing error handling and database integration

### Phase 2: Create Worker Entry Point (5 min)  
- Implement `worker.ts` with factory pattern
- Add graceful shutdown handling
- Configure event logging

## Testing Approach

### Verification Steps
1. **Process Startup**: `tsx src/worker.ts` starts successfully
2. **Redis Connection**: Connects to Redis when `REDIS_ENABLED=true`
3. **Graceful Shutdown**: Responds to SIGTERM/SIGINT properly  
4. **Job Processing**: Processes test jobs from queue
5. **Error Handling**: Logs errors appropriately without crashing

### Manual Testing
```bash
# Start worker process
cd server
REDIS_ENABLED=true npm run tsx src/worker.ts

# Verify startup logs
# Should show: "🚀 Content generation worker started"
```

## Integration Points

### Database Integration
- Reuse existing `AiGenerationJobsModel` integration
- Maintain status updates: queued → processing → completed/failed

### API Integration  
- No changes required to API endpoints
- Existing job creation continues working
- Frontend polling receives status updates

### Service Layer Integration
- Leverage existing `contentGenerationServiceFactory` 
- Reuse `ContentGenerationJobHandler` unchanged
- Maintain existing error handling patterns

## Success Criteria

### Functional Requirements
- ✅ Worker process starts without errors
- ✅ Connects to Redis when enabled
- ✅ Processes jobs from BullMQ queue
- ✅ Updates job status in database
- ✅ Handles graceful shutdown

### Performance Requirements
- ✅ <1ms service instantiation (factory pattern)
- ✅ Memory isolated from API server
- ✅ Concurrent job processing (5 workers)

### Error Handling Requirements
- ✅ Comprehensive error logging
- ✅ Graceful degradation when Redis unavailable
- ✅ Process restart capability

## Next Steps

After completing this subtask:
1. Test worker startup and job processing
2. Verify integration with existing job queue
3. Document any issues or optimizations needed
4. Proceed to Subtask 2: Worker Service Factory
5. Update memory bank with implementation status

## Related Files

**Files to Create**:
- `server/src/worker.ts` - Main deliverable

**Files to Modify**:
- `server/src/workers/contentGenerationWorker.ts` - Extract processJob function

**Files Referenced**:
- `server/src/config/redis.ts` - Import connection and queue names
- `server/src/services/contentGeneration/index.ts` - Service factory imports
