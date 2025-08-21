# Task 3.1.D.2: AI Dashboard Hooks & State Management

## **Overview**
Implement optimized React hooks for AI dashboard state management using useReducer pattern, create centralized polling integration, and add offline detection with graceful degradation logic.

## **Duration**: 2 hours

## **Dependencies**
- ✅ Task 3.1.D.1 (API Service Extension) - Provides API methods and types
- ✅ Existing React patterns in codebase
- ✅ Material-UI components for consistent styling

## **Technical Approach**

### **Performance-First Hook Design**
- Use `useReducer` instead of multiple `useState` calls to minimize re-renders
- Implement `useMemo` and `useCallback` for expensive operations
- Centralized state management preventing prop drilling

### **Polling Integration Strategy**
- Integrate with centralized `PollingManager` from previous subtask
- Automatic cleanup on component unmount
- Intelligent polling based on job priority and user activity

### **Offline Detection & Graceful Degradation**
- Detect network connectivity changes
- Fallback to cached content when AI services unavailable
- Progressive enhancement maintaining core functionality

## **Implementation Details**

### **1. Core AI Dashboard Hook (45 minutes)**

**File**: `client/src/hooks/useAIDashboard.ts`

```typescript
import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { AIDashboardState, AIDashboardAction, DailyLearningPlan, ContentRecommendation } from '../types/AIDashboard.js';
import api from '../services/api.js';

// Initial state
const initialState: AIDashboardState = {
  dailyPlan: null,
  recommendations: [],
  activeJobs: new Map(),
  isLoading: false,
  error: null,
  lastUpdated: null
};

// Reducer for state management
function aiDashboardReducer(state: AIDashboardState, action: AIDashboardAction): AIDashboardState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_DAILY_PLAN':
      return { 
        ...state, 
        dailyPlan: action.payload, 
        isLoading: false, 
        error: null,
        lastUpdated: new Date().toISOString()
      };
    
    case 'SET_RECOMMENDATIONS':
      return { 
        ...state, 
        recommendations: action.payload, 
        isLoading: false, 
        error: null 
      };
    
    case 'ADD_JOB':
      const newActiveJobs = new Map(state.activeJobs);
      newActiveJobs.set(action.payload.jobId, action.payload);
      return { ...state, activeJobs: newActiveJobs };
    
    case 'UPDATE_JOB':
      const updatedActiveJobs = new Map(state.activeJobs);
      updatedActiveJobs.set(action.payload.jobId, action.payload.job);
      return { ...state, activeJobs: updatedActiveJobs };
    
    case 'REMOVE_JOB':
      const filteredActiveJobs = new Map(state.activeJobs);
      filteredActiveJobs.delete(action.payload);
      return { ...state, activeJobs: filteredActiveJobs };
    
    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };
    
    default:
      return state;
  }
}

export function useAIDashboard() {
  const [state, dispatch] = useReducer(aiDashboardReducer, initialState);

  // Memoized selectors to prevent unnecessary re-renders
  const memoizedDailyPlan = useMemo(() => state.dailyPlan, [state.dailyPlan]);
  const memoizedRecommendations = useMemo(() => state.recommendations, [state.recommendations]);
  const activeJobsArray = useMemo(() => Array.from(state.activeJobs.values()), [state.activeJobs]);

  // Load initial dashboard data
  const loadDashboardData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Load daily plan and recommendations in parallel
      const [dailyPlan, recommendations] = await Promise.all([
        api.aiDashboard.getDailyPlan().catch(() => null), // Graceful failure
        api.aiDashboard.getRecommendations().catch(() => []) // Graceful failure
      ]);

      if (dailyPlan) {
        dispatch({ type: 'SET_DAILY_PLAN', payload: dailyPlan });
      }
      
      if (recommendations.length > 0) {
        dispatch({ type: 'SET_RECOMMENDATIONS', payload: recommendations });
      }

      // Load active jobs
      const activeJobs = await api.aiDashboard.listJobs().catch(() => []);
      activeJobs.forEach(job => {
        dispatch({ type: 'ADD_JOB', payload: job });
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to load dashboard data. Please try again.' 
      });
    }
  }, []);

  // Refresh daily plan
  const refreshDailyPlan = useCallback(async () => {
    try {
      const dailyPlan = await api.aiDashboard.getDailyPlan();
      dispatch({ type: 'SET_DAILY_PLAN', payload: dailyPlan });
    } catch (error) {
      console.error('Failed to refresh daily plan:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to refresh daily plan. Please try again.' 
      });
    }
  }, []);

  // Update job status
  const updateJobStatus = useCallback((jobId: string, job: any) => {
    dispatch({ type: 'UPDATE_JOB', payload: { jobId, job } });
  }, []);

  // Remove completed job
  const removeJob = useCallback((jobId: string) => {
    dispatch({ type: 'REMOVE_JOB', payload: jobId });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // Load data on mount
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    // State
    dailyPlan: memoizedDailyPlan,
    recommendations: memoizedRecommendations,
    activeJobs: activeJobsArray,
    isLoading: state.isLoading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    
    // Actions
    refreshDailyPlan,
    updateJobStatus,
    removeJob,
    clearError,
    reload: loadDashboardData
  };
}
```

### **2. AI Content Generation Hook with Polling (45 minutes)**

**File**: `client/src/hooks/useAIContentGeneration.ts`

```typescript
import { useState, useCallback, useEffect, useRef } from 'react';
import { ContentGenerationRequest, AIGenerationJob } from '../types/AIDashboard.js';
import { pollingManager } from '../utils/aiPolling.js';
import api from '../services/api.js';

interface UseAIContentGenerationReturn {
  generateContent: (request: ContentGenerationRequest) => Promise<string>;
  jobStatuses: Map<string, AIGenerationJob>;
  isGenerating: boolean;
  cancelJob: (jobId: string) => Promise<void>;
  clearCompletedJobs: () => void;
  getJobResult: (jobId: string) => any | null;
}

export function useAIContentGeneration(): UseAIContentGenerationReturn {
  const [jobStatuses, setJobStatuses] = useState<Map<string, AIGenerationJob>>(new Map());
  const [isGenerating, setIsGenerating] = useState(false);
  const activeJobsRef = useRef<Set<string>>(new Set());

  // Generate content and start polling
  const generateContent = useCallback(async (request: ContentGenerationRequest): Promise<string> => {
    setIsGenerating(true);
    
    try {
      // Start content generation
      const { jobId } = await api.aiDashboard.generateContent(request);
      
      // Add to active jobs
      activeJobsRef.current.add(jobId);
      
      // Create initial job status
      const initialJob: AIGenerationJob = {
        jobId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setJobStatuses(prev => new Map(prev).set(jobId, initialJob));

      // Start polling for job status
      pollingManager.startPolling(
        jobId,
        // onUpdate
        (job: AIGenerationJob) => {
          setJobStatuses(prev => new Map(prev).set(jobId, job));
        },
        // onComplete
        (job: AIGenerationJob) => {
          setJobStatuses(prev => new Map(prev).set(jobId, job));
          activeJobsRef.current.delete(jobId);
          
          // Update isGenerating if no more active jobs
          if (activeJobsRef.current.size === 0) {
            setIsGenerating(false);
          }
        },
        // onError
        (error: Error) => {
          console.error(`Job ${jobId} failed:`, error);
          const failedJob: AIGenerationJob = {
            ...initialJob,
            status: 'failed',
            error: error.message,
            updatedAt: new Date().toISOString()
          };
          setJobStatuses(prev => new Map(prev).set(jobId, failedJob));
          activeJobsRef.current.delete(jobId);
          
          // Update isGenerating if no more active jobs
          if (activeJobsRef.current.size === 0) {
            setIsGenerating(false);
          }
        }
      );

      return jobId;
    } catch (error) {
      setIsGenerating(false);
      throw error;
    }
  }, []);

  // Cancel a job
  const cancelJob = useCallback(async (jobId: string) => {
    try {
      await api.aiDashboard.cancelJob(jobId);
      pollingManager.stopPolling(jobId);
      activeJobsRef.current.delete(jobId);
      
      // Update job status to cancelled
      setJobStatuses(prev => {
        const updated = new Map(prev);
        const job = updated.get(jobId);
        if (job) {
          updated.set(jobId, {
            ...job,
            status: 'failed',
            error: 'Cancelled by user',
            updatedAt: new Date().toISOString()
          });
        }
        return updated;
      });

      // Update isGenerating if no more active jobs
      if (activeJobsRef.current.size === 0) {
        setIsGenerating(false);
      }
    } catch (error) {
      console.error(`Failed to cancel job ${jobId}:`, error);
    }
  }, []);

  // Clear completed jobs from state
  const clearCompletedJobs = useCallback(() => {
    setJobStatuses(prev => {
      const filtered = new Map();
      for (const [jobId, job] of prev) {
        if (job.status === 'pending' || job.status === 'processing') {
          filtered.set(jobId, job);
        }
      }
      return filtered;
    });
  }, []);

  // Get job result
  const getJobResult = useCallback((jobId: string) => {
    const job = jobStatuses.get(jobId);
    return job?.status === 'completed' ? job.result : null;
  }, [jobStatuses]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel all active polling operations
      for (const jobId of activeJobsRef.current) {
        pollingManager.stopPolling(jobId);
      }
      activeJobsRef.current.clear();
    };
  }, []);

  return {
    generateContent,
    jobStatuses,
    isGenerating,
    cancelJob,
    clearCompletedJobs,
    getJobResult
  };
}
```

### **3. Offline Detection Hook (30 minutes)**

**File**: `client/src/hooks/useOfflineDetection.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';

interface UseOfflineDetectionReturn {
  isOnline: boolean;
  isOffline: boolean;
  lastOnlineAt: Date | null;
  retryConnection: () => Promise<boolean>;
}

export function useOfflineDetection(): UseOfflineDetectionReturn {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(
    navigator.onLine ? new Date() : null
  );

  // Test connection by making a lightweight request
  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      // Use a lightweight endpoint or ping
      const response = await fetch('/api/v1/meta/health', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  // Retry connection
  const retryConnection = useCallback(async (): Promise<boolean> => {
    const connectionStatus = await testConnection();
    setIsOnline(connectionStatus);
    
    if (connectionStatus) {
      setLastOnlineAt(new Date());
    }
    
    return connectionStatus;
  }, [testConnection]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = async () => {
      // Verify actual connectivity, not just network interface
      const actuallyOnline = await testConnection();
      setIsOnline(actuallyOnline);
      
      if (actuallyOnline) {
        setLastOnlineAt(new Date());
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial connection test
    testConnection().then(online => {
      setIsOnline(online);
      if (online) {
        setLastOnlineAt(new Date());
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [testConnection]);

  return {
    isOnline,
    isOffline: !isOnline,
    lastOnlineAt,
    retryConnection
  };
}
```

## **Files Created**

### **New Files**
- `client/src/hooks/useAIDashboard.ts` - Core AI dashboard state management
- `client/src/hooks/useAIContentGeneration.ts` - Content generation with polling
- `client/src/hooks/useOfflineDetection.ts` - Network connectivity detection

## **Key Technical Decisions**

### **1. useReducer vs useState**
**Decision**: Use `useReducer` for complex state management
**Rationale**:
- Prevents multiple re-renders from multiple `useState` calls
- Centralized state updates with predictable state transitions
- Better performance for complex state objects
- Easier to test and debug state changes

### **2. Memoization Strategy**
**Decision**: Strategic use of `useMemo` and `useCallback`
**Rationale**:
- Prevent unnecessary re-renders of expensive computations
- Stable references for dependency arrays
- Optimize child component re-rendering
- Balance between performance and code complexity

### **3. Polling Integration**
**Decision**: Integrate with centralized `PollingManager`
**Rationale**:
- Reuse existing resource management and backoff logic
- Consistent polling behavior across all components
- Automatic cleanup and memory management
- Better user experience with coordinated polling

### **4. Graceful Degradation**
**Decision**: Offline detection with fallback strategies
**Rationale**:
- Progressive enhancement maintaining core functionality
- Better user experience during network issues
- Cached content availability when AI services unavailable
- Clear user feedback about connectivity status

## **Performance Optimizations**

### **State Management**
```typescript
// ✅ Optimized: Single reducer with memoized selectors
const [state, dispatch] = useReducer(aiDashboardReducer, initialState);
const memoizedDailyPlan = useMemo(() => state.dailyPlan, [state.dailyPlan]);

// ❌ Avoid: Multiple useState causing multiple re-renders
const [dailyPlan, setDailyPlan] = useState(null);
const [recommendations, setRecommendations] = useState([]);
const [isLoading, setIsLoading] = useState(false);
```

### **Callback Optimization**
```typescript
// ✅ Optimized: Stable callback references
const refreshDailyPlan = useCallback(async () => {
  // Implementation
}, []); // Empty dependency array for stable reference

// ❌ Avoid: New function on every render
const refreshDailyPlan = async () => {
  // Implementation
}; // Creates new function on every render
```

### **Memory Management**
```typescript
// ✅ Proper cleanup on unmount
useEffect(() => {
  return () => {
    // Cancel all active polling operations
    for (const jobId of activeJobsRef.current) {
      pollingManager.stopPolling(jobId);
    }
    activeJobsRef.current.clear();
  };
}, []);
```

## **Error Handling Strategy**

### **API Error Handling**
- Graceful failure for non-critical operations (daily plan, recommendations)
- User-friendly error messages with retry options
- Automatic fallback to cached content when available
- Clear error state management with recovery actions

### **Polling Error Handling**
- Integration with `PollingManager` error callbacks
- Job status updates for failed operations
- Automatic cleanup of failed jobs
- User notification of job failures with retry options

## **Testing Strategy**

### **Unit Tests Required**
```typescript
// client/src/hooks/__tests__/useAIDashboard.test.ts
describe('useAIDashboard', () => {
  test('should load dashboard data on mount');
  test('should handle API errors gracefully');
  test('should update state correctly with reducer');
  test('should memoize expensive computations');
});

// client/src/hooks/__tests__/useAIContentGeneration.test.ts
describe('useAIContentGeneration', () => {
  test('should generate content and start polling');
  test('should handle job completion correctly');
  test('should cancel jobs properly');
  test('should cleanup on unmount');
});

// client/src/hooks/__tests__/useOfflineDetection.test.ts
describe('useOfflineDetection', () => {
  test('should detect online/offline status');
  test('should test actual connectivity');
  test('should retry connection correctly');
});
```

## **Integration Points**

### **Backend Integration**
- Uses API methods from Task 3.1.D.1
- Integrates with existing authentication system
- Leverages existing error handling patterns

### **Frontend Integration**
- Compatible with existing React patterns in codebase
- Integrates with Material-UI components
- Follows established hook patterns and naming conventions

## **Completion Criteria**

- [ ] Core AI dashboard hook with optimized state management
- [ ] Content generation hook with centralized polling integration
- [ ] Offline detection hook with connectivity testing
- [ ] Performance optimizations with memoization and cleanup
- [ ] Error handling with graceful degradation
- [ ] Unit tests for all hooks
- [ ] Integration with existing authentication and API patterns
- [ ] Memory leak prevention with proper cleanup

## **Next Steps**
After completion, proceed to **Task 3.1.D.3: AI Dashboard Components Implementation** which will use these hooks to create the actual UI components for the AI-enhanced dashboard.

---

**Estimated Time**: 2 hours  
**Priority**: Critical - Provides state management foundation for AI dashboard UI  
**Dependencies**: Task 3.1.D.1 (API Service Extension) completed
