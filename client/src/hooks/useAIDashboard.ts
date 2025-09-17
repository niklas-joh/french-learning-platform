import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { AIDashboardState, AIDashboardAction, AIGenerationJob } from '../types/AIDashboard.js';
import api from '../services/api';

/**
 * Initial state for the AI Dashboard hook
 * Follows established patterns from existing hooks in the codebase
 */
const initialState: AIDashboardState = {
  dailyPlan: null,
  recommendations: [],
  activeJobs: new Map(),
  isLoading: false,
  error: null,
  lastUpdated: null
};

/**
 * Reducer function for AI Dashboard state management
 * Uses consistent action patterns aligned with development principles
 * 
 * @param state - Current state of the AI dashboard
 * @param action - Action to be performed on the state
 * @returns Updated state based on the action
 */
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

/**
 * AI Dashboard Hook - Lightweight wrapper around existing API infrastructure
 * 
 * This hook provides state management for the AI dashboard while leveraging
 * the existing sophisticated API service layer and following established
 * patterns from the codebase.
 * 
 * Key architectural decisions:
 * - Reuses existing API service methods from api.aiDashboard
 * - Follows useReducer pattern for complex state management
 * - Implements memoization for performance optimization
 * - Integrates with existing error handling patterns
 * - Maintains consistency with development principles
 * 
 * @returns Object containing dashboard state and action methods
 */
export function useAIDashboard() {
  const [state, dispatch] = useReducer(aiDashboardReducer, initialState);

  // Memoized selectors to prevent unnecessary re-renders
  // Following performance optimization patterns from existing hooks
  const memoizedDailyPlan = useMemo(() => state.dailyPlan, [state.dailyPlan]);
  const memoizedRecommendations = useMemo(() => state.recommendations, [state.recommendations]);
  const activeJobsArray = useMemo(() => Array.from(state.activeJobs.values()), [state.activeJobs]);

  /**
   * Load initial dashboard data using existing API service methods
   * Leverages sophisticated error handling and factory patterns from api.ts
   */
  const loadDashboardData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const apiWithDashboard = api as any;
      
      // Use existing API service methods with built-in error handling
      // This avoids duplicating the sophisticated error handling logic
      const [dailyPlan, recommendations] = await Promise.all([
        apiWithDashboard.aiDashboard.getDailyPlan().catch(() => null), // Graceful failure
        apiWithDashboard.aiDashboard.getRecommendations().catch(() => []) // Graceful failure
      ]);

      if (dailyPlan) {
        dispatch({ type: 'SET_DAILY_PLAN', payload: dailyPlan });
      }
      
      if (recommendations.length > 0) {
        dispatch({ type: 'SET_RECOMMENDATIONS', payload: recommendations });
      }

      // Load active jobs using existing API infrastructure
      const activeJobs = await apiWithDashboard.aiDashboard.listJobs().catch(() => []);
      activeJobs.forEach((job: AIGenerationJob) => {
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

  /**
   * Refresh daily plan using existing API service
   * Maintains consistency with established error handling patterns
   */
  const refreshDailyPlan = useCallback(async () => {
    try {
      const apiWithDashboard = api as any;
      const dailyPlan = await apiWithDashboard.aiDashboard.getDailyPlan();
      dispatch({ type: 'SET_DAILY_PLAN', payload: dailyPlan });
    } catch (error) {
      console.error('Failed to refresh daily plan:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to refresh daily plan. Please try again.' 
      });
    }
  }, []);

  /**
   * Update job status in local state
   * This provides immediate UI feedback while job polling handles backend sync
   */
  const updateJobStatus = useCallback((jobId: string, job: any) => {
    dispatch({ type: 'UPDATE_JOB', payload: { jobId, job } });
  }, []);

  /**
   * Remove completed job from local state
   * Used in conjunction with polling infrastructure for cleanup
   */
  const removeJob = useCallback((jobId: string) => {
    dispatch({ type: 'REMOVE_JOB', payload: jobId });
  }, []);

  /**
   * Clear error state
   * Follows established error handling patterns from existing hooks
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // Load data on mount - following established patterns
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    // State - using memoized values for performance
    dailyPlan: memoizedDailyPlan,
    recommendations: memoizedRecommendations,
    activeJobs: activeJobsArray,
    isLoading: state.isLoading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    
    // Actions - stable callback references
    refreshDailyPlan,
    updateJobStatus,
    removeJob,
    clearError,
    reload: loadDashboardData
  };
}
