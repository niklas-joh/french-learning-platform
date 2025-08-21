# Task 3.1.D.1: API Service Extension & Type System

## **Overview**
Extend the existing `client/src/services/api.ts` with AI dashboard methods and create minimal type definitions that build upon existing AI types. Implement efficient polling manager for job status tracking with resource management.

## **Duration**: 2 hours

## **Dependencies**
- ✅ Task 3.1.A (AI Orchestrator) - Provides backend AI endpoints
- ✅ Task 3.1.B (Content Generation) - Provides job queue system
- ✅ Existing `client/src/services/api.ts` - Base API service patterns

## **Technical Approach**

### **Extend Existing API Service (Not Create New)**
Following development principles and existing patterns, we extend the current API service rather than creating a new service class.

### **Type System Strategy**
- Extend existing AI types from `server/src/types/AI.ts`
- Create minimal dashboard-specific types only when necessary
- Reuse existing job queue and content generation types

### **Polling Manager Architecture**
- Centralized polling with resource management
- Maximum 3 concurrent polling operations
- Exponential backoff with intelligent cleanup

## **Implementation Details**

### **1. Create AI Dashboard Types (30 minutes)**

**File**: `client/src/types/AIDashboard.ts`

```typescript
import { AITaskPayloads } from '../../../server/src/types/AI.js';

// Extend existing AI types rather than duplicating
export interface DailyLearningPlan {
  id: string;
  userId: string;
  generatedAt: string;
  lessons: AITaskPayloads['GENERATE_LESSON']['response'][];
  recommendations: ContentRecommendation[];
  estimatedDuration: number;
  difficulty: CEFRLevel;
}

export interface ContentRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'vocabulary_drill' | 'grammar_exercise';
  difficulty: CEFRLevel;
  estimatedTime: number;
  reason: string; // Why this is recommended
  priority: 'high' | 'medium' | 'low';
}

export interface AIGenerationJob {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentGenerationRequest {
  topic: string;
  contentType: 'lesson' | 'vocabulary_drill' | 'grammar_exercise';
  difficulty?: CEFRLevel;
  estimatedTime?: number;
  focusAreas?: string[];
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// Dashboard state management types
export interface AIDashboardState {
  dailyPlan: DailyLearningPlan | null;
  recommendations: ContentRecommendation[];
  activeJobs: Map<string, AIGenerationJob>;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export type AIDashboardAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DAILY_PLAN'; payload: DailyLearningPlan }
  | { type: 'SET_RECOMMENDATIONS'; payload: ContentRecommendation[] }
  | { type: 'ADD_JOB'; payload: AIGenerationJob }
  | { type: 'UPDATE_JOB'; payload: { jobId: string; job: AIGenerationJob } }
  | { type: 'REMOVE_JOB'; payload: string }
  | { type: 'SET_LAST_UPDATED'; payload: string };
```

### **2. Extend API Service with AI Dashboard Methods (45 minutes)**

**File**: `client/src/services/api.ts` (extend existing)

```typescript
// Add to existing api.ts file - don't create new service

// AI Dashboard API methods
const aiDashboardMethods = {
  // Get personalized daily learning plan
  getDailyPlan: async (): Promise<DailyLearningPlan> => {
    const response = await api.get('/ai/dashboard/daily-plan');
    return response.data;
  },

  // Generate content with immediate job ID return
  generateContent: async (request: ContentGenerationRequest): Promise<{ jobId: string }> => {
    const response = await api.post('/ai/generate', {
      contentType: request.contentType,
      topic: request.topic,
      difficulty: request.difficulty || 'A1',
      estimatedTime: request.estimatedTime || 15,
      focusAreas: request.focusAreas || []
    });
    return response.data;
  },

  // Get job status for polling
  getJobStatus: async (jobId: string): Promise<AIGenerationJob> => {
    const response = await api.get(`/ai/generate/status/${jobId}`);
    return response.data;
  },

  // Get personalized recommendations
  getRecommendations: async (): Promise<ContentRecommendation[]> => {
    const response = await api.get('/ai/dashboard/recommendations');
    return response.data;
  },

  // List user's active jobs
  listJobs: async (): Promise<AIGenerationJob[]> => {
    const response = await api.get('/ai/jobs');
    return response.data.data; // API returns { success: true, data: [...] }
  },

  // Cancel a job
  cancelJob: async (jobId: string): Promise<void> => {
    await api.delete(`/ai/jobs/${jobId}`);
  }
};

// Extend existing api object (don't create new service)
Object.assign(api, { aiDashboard: aiDashboardMethods });

// Type augmentation for TypeScript
declare module './api' {
  interface ApiInstance {
    aiDashboard: typeof aiDashboardMethods;
  }
}

export default api;
```

### **3. Implement Centralized Polling Manager (45 minutes)**

**File**: `client/src/utils/aiPolling.ts`

```typescript
import { AIGenerationJob } from '../types/AIDashboard.js';
import api from '../services/api.js';

export interface PollingOptions {
  initialInterval?: number;
  maxInterval?: number;
  maxRetries?: number;
  backoffMultiplier?: number;
}

export class PollingManager {
  private activePolls = new Set<string>();
  private pollingIntervals = new Map<string, NodeJS.Timeout>();
  private maxConcurrent = 3;
  private waitingQueue: Array<() => void> = [];

  async startPolling(
    jobId: string,
    onUpdate: (job: AIGenerationJob) => void,
    onComplete: (job: AIGenerationJob) => void,
    onError: (error: Error) => void,
    options: PollingOptions = {}
  ): Promise<void> {
    // Wait for available slot if at max concurrent
    if (this.activePolls.size >= this.maxConcurrent) {
      await this.waitForSlot();
    }

    this.activePolls.add(jobId);
    
    const {
      initialInterval = 1000,
      maxInterval = 30000,
      maxRetries = 30,
      backoffMultiplier = 1.5
    } = options;

    let currentInterval = initialInterval;
    let retryCount = 0;

    const poll = async () => {
      try {
        const job = await api.aiDashboard.getJobStatus(jobId);
        onUpdate(job);

        if (job.status === 'completed') {
          onComplete(job);
          this.stopPolling(jobId);
          return;
        }

        if (job.status === 'failed') {
          onError(new Error(job.error || 'Job failed'));
          this.stopPolling(jobId);
          return;
        }

        // Continue polling with exponential backoff
        if (retryCount < maxRetries) {
          retryCount++;
          currentInterval = Math.min(currentInterval * backoffMultiplier, maxInterval);
          
          const timeoutId = setTimeout(poll, currentInterval);
          this.pollingIntervals.set(jobId, timeoutId);
        } else {
          onError(new Error('Polling timeout - maximum retries exceeded'));
          this.stopPolling(jobId);
        }
      } catch (error) {
        console.error(`Polling error for job ${jobId}:`, error);
        onError(error instanceof Error ? error : new Error('Unknown polling error'));
        this.stopPolling(jobId);
      }
    };

    // Start initial poll
    poll();
  }

  stopPolling(jobId: string): void {
    const timeoutId = this.pollingIntervals.get(jobId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.pollingIntervals.delete(jobId);
    }
    
    this.activePolls.delete(jobId);
    
    // Process waiting queue
    if (this.waitingQueue.length > 0) {
      const nextCallback = this.waitingQueue.shift();
      if (nextCallback) {
        nextCallback();
      }
    }
  }

  private async waitForSlot(): Promise<void> {
    return new Promise((resolve) => {
      this.waitingQueue.push(resolve);
    });
  }

  // Cleanup all polling operations
  cleanup(): void {
    for (const [jobId, timeoutId] of this.pollingIntervals) {
      clearTimeout(timeoutId);
    }
    this.pollingIntervals.clear();
    this.activePolls.clear();
    this.waitingQueue.length = 0;
  }

  // Get current polling status
  getStatus(): {
    activePolls: number;
    maxConcurrent: number;
    waitingQueue: number;
  } {
    return {
      activePolls: this.activePolls.size,
      maxConcurrent: this.maxConcurrent,
      waitingQueue: this.waitingQueue.length
    };
  }
}

// Export singleton instance
export const pollingManager = new PollingManager();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    pollingManager.cleanup();
  });
}
```

## **Files Created/Modified**

### **New Files**
- `client/src/types/AIDashboard.ts` - AI dashboard type definitions
- `client/src/utils/aiPolling.ts` - Centralized polling manager

### **Modified Files**
- `client/src/services/api.ts` - Extended with AI dashboard methods

## **Key Technical Decisions**

### **1. Extend vs Create New Service**
**Decision**: Extend existing `api.ts` rather than creating new service class
**Rationale**: 
- Follows established patterns in codebase
- Avoids service proliferation and complexity
- Leverages existing authentication and interceptors
- Maintains consistency with development principles

### **2. Type System Strategy**
**Decision**: Minimal new types, extend existing AI types
**Rationale**:
- Prevents type duplication and drift
- Leverages existing AI type system from backend
- Easier maintenance and consistency
- Follows DRY principles

### **3. Centralized Polling Manager**
**Decision**: Single polling manager with resource limits
**Rationale**:
- Prevents resource exhaustion with concurrent limits
- Exponential backoff reduces server load
- Centralized cleanup prevents memory leaks
- Better user experience with queue management

## **Testing Strategy**

### **Unit Tests Required**
```typescript
// client/src/utils/__tests__/aiPolling.test.ts
describe('PollingManager', () => {
  test('should limit concurrent polling operations');
  test('should implement exponential backoff');
  test('should cleanup resources properly');
  test('should handle job completion correctly');
  test('should handle job failures gracefully');
});

// client/src/services/__tests__/api.aiDashboard.test.ts
describe('API AI Dashboard Methods', () => {
  test('should fetch daily plan correctly');
  test('should generate content and return job ID');
  test('should get job status');
  test('should handle API errors gracefully');
});
```

## **Error Handling Strategy**

### **API Error Handling**
- Leverage existing API interceptors for authentication errors
- Specific error handling for AI service unavailability
- Graceful degradation when backend AI services are down
- User-friendly error messages for different failure scenarios

### **Polling Error Handling**
- Exponential backoff for temporary network issues
- Maximum retry limits to prevent infinite polling
- Proper cleanup on component unmount
- Error callbacks for job failures

## **Performance Considerations**

### **Memory Management**
- Proper cleanup of polling intervals
- Limited concurrent operations (max 3)
- Efficient job status caching
- Component unmount cleanup

### **Network Optimization**
- Exponential backoff reduces server load
- Intelligent polling intervals based on job type
- Request deduplication for identical job status requests
- Caching of completed job results

## **Integration Points**

### **Backend Dependencies**
- `POST /api/ai/generate` - Content generation endpoint
- `GET /api/ai/generate/status/:jobId` - Job status endpoint
- `GET /api/ai/jobs` - List user jobs endpoint
- `DELETE /api/ai/jobs/:jobId` - Cancel job endpoint

### **Frontend Integration**
- Existing authentication system via API interceptors
- Material-UI components for consistent styling
- React hooks for state management (next subtask)
- Error boundary integration for graceful failures

## **Completion Criteria**

- [ ] AI dashboard types created extending existing AI types
- [ ] API service extended with dashboard methods (not new service)
- [ ] Centralized polling manager implemented with resource limits
- [ ] ESM compliance with proper `.js` extensions
- [ ] Error handling for API failures and polling issues
- [ ] Unit tests for polling manager and API methods
- [ ] Integration with existing authentication system
- [ ] Performance optimizations for memory and network usage

## **Next Steps**
After completion, proceed to **Task 3.1.D.2: AI Dashboard Hooks & State Management** which will build upon these API methods and types to create optimized React hooks for dashboard state management.

---

**Estimated Time**: 2 hours  
**Priority**: Critical - Foundation for all subsequent AI dashboard functionality  
**Dependencies**: All satisfied (3.1.A, 3.1.B, 3.1.C completed)
