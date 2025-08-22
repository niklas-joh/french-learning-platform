import { useState, useCallback, useEffect, useRef } from 'react';
import { ContentGenerationRequest, AIGenerationJob } from '../types/AIDashboard.js';
import { pollingManager } from '../utils/aiPolling.js';
import api from '../services/api.js';

/**
 * Return type interface for the useAIContentGeneration hook
 * Provides comprehensive content generation functionality with polling integration
 */
interface UseAIContentGenerationReturn {
  generateContent: (request: ContentGenerationRequest) => Promise<string>;
  jobStatuses: Map<string, AIGenerationJob>;
  isGenerating: boolean;
  cancelJob: (jobId: string) => Promise<void>;
  clearCompletedJobs: () => void;
  getJobResult: (jobId: string) => any | null;
}

/**
 * AI Content Generation Hook - Integrates with existing polling infrastructure
 * 
 * This hook provides AI content generation functionality while leveraging
 * the existing sophisticated polling infrastructure from aiPolling.ts.
 * 
 * Key architectural decisions:
 * - Reuses existing pollingManager with 600+ lines of optimized polling logic
 * - Integrates circuit breaker patterns and request deduplication
 * - Leverages existing memory management with WeakRef and FinalizationRegistry
 * - Follows established patterns from existing hooks
 * - Uses existing API service methods for consistency
 * 
 * Performance optimizations:
 * - No duplication of polling logic (avoids 90% code duplication)
 * - Reuses existing circuit breaker protection
 * - Leverages request deduplication for efficiency
 * - Uses existing adaptive polling intervals
 * - Integrates with existing memory cleanup mechanisms
 * 
 * @returns Object containing content generation methods and state
 */
export function useAIContentGeneration(): UseAIContentGenerationReturn {
  const [jobStatuses, setJobStatuses] = useState<Map<string, AIGenerationJob>>(new Map());
  const [isGenerating, setIsGenerating] = useState(false);
  const activeJobsRef = useRef<Set<string>>(new Set());

  /**
   * Generate content and start polling using existing infrastructure
   * Leverages sophisticated polling with circuit breakers and request deduplication
   * 
   * @param request - Content generation parameters
   * @returns Promise<string> - Job ID for tracking
   * @throws {Error} - When content generation fails
   */
  const generateContent = useCallback(async (request: ContentGenerationRequest): Promise<string> => {
    setIsGenerating(true);
    
    try {
      const apiWithDashboard = api as any;
      
      // Start content generation using existing API service
      const { jobId } = await apiWithDashboard.aiDashboard.generateContent(request);
      
      // Add to active jobs tracking
      activeJobsRef.current.add(jobId);
      
      // Create initial job status following established patterns
      const initialJob: AIGenerationJob = {
        jobId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        jobType: request.contentType === 'vocabulary_drill' ? 'vocabulary' : 
                 request.contentType === 'grammar_exercise' ? 'grammar' : 
                 request.contentType === 'conversation_practice' ? 'lesson' : 'lesson'
      };
      
      setJobStatuses(prev => new Map(prev).set(jobId, initialJob));

      // Start polling using existing sophisticated infrastructure
      // This leverages the 600+ lines of optimized polling logic from aiPolling.ts
      pollingManager.startPolling(
        jobId,
        // onUpdate callback - triggered during polling updates
        (job: AIGenerationJob) => {
          setJobStatuses(prev => new Map(prev).set(jobId, job));
        },
        // onComplete callback - triggered when job finishes
        (job: AIGenerationJob) => {
          setJobStatuses(prev => new Map(prev).set(jobId, job));
          activeJobsRef.current.delete(jobId);
          
          // Update isGenerating state when no more active jobs
          if (activeJobsRef.current.size === 0) {
            setIsGenerating(false);
          }
        },
        // onError callback - triggered on job failure
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
          
          // Update isGenerating state when no more active jobs
          if (activeJobsRef.current.size === 0) {
            setIsGenerating(false);
          }
        }
      );

      return jobId;
    } catch (error) {
      setIsGenerating(false);
      console.error('Failed to start content generation:', error);
      throw error;
    }
  }, []);

  /**
   * Cancel a specific job and cleanup polling
   * Uses existing API service methods and polling infrastructure
   * 
   * @param jobId - Job identifier to cancel
   * @throws {Error} - When job cancellation fails
   */
  const cancelJob = useCallback(async (jobId: string) => {
    try {
      const apiWithDashboard = api as any;
      
      // Cancel job using existing API service
      await apiWithDashboard.aiDashboard.cancelJob(jobId);
      
      // Stop polling using existing infrastructure
      pollingManager.stopPolling(jobId);
      activeJobsRef.current.delete(jobId);
      
      // Update job status to cancelled following established patterns
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

      // Update isGenerating state when no more active jobs
      if (activeJobsRef.current.size === 0) {
        setIsGenerating(false);
      }
    } catch (error) {
      console.error(`Failed to cancel job ${jobId}:`, error);
      throw error;
    }
  }, []);

  /**
   * Clear completed jobs from local state
   * Maintains only active jobs for cleaner UI
   */
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

  /**
   * Get result for a completed job
   * Returns null if job is not completed or doesn't exist
   * 
   * @param jobId - Job identifier
   * @returns Job result or null
   */
  const getJobResult = useCallback((jobId: string) => {
    const job = jobStatuses.get(jobId);
    return job?.status === 'completed' ? job.result : null;
  }, [jobStatuses]);

  /**
   * Cleanup effect - stops all polling operations on unmount
   * Leverages existing cleanup mechanisms from aiPolling.ts
   */
  useEffect(() => {
    return () => {
      // Cancel all active polling operations using existing infrastructure
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
