import axios from 'axios';

// Create a dedicated Axios instance for our API
const api = axios.create({
  baseURL: '/api/v1', // Pointing to the versioned API
});

/**
 * Request Interceptor
 *
 * This interceptor runs before each request is sent.
 * Its purpose is to dynamically add the Authorization header
 * to every API request, ensuring the user is authenticated.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // This part handles errors that occur when setting up the request.
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 *
 * This interceptor runs after a response is received.
 * Its primary purpose is to globally handle authentication errors (401).
 * If a 401 is detected, it means the user's session is no longer valid.
 * We then clear the local session data and redirect to the login page.
 *
 * A custom event 'auth-error' is dispatched to allow the AuthContext
 * to react and update its state, ensuring a clean logout.
 */
api.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it.
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized: Token is invalid or expired.
      console.error("Authentication error: Token is invalid or expired. Logging out.");
      localStorage.removeItem('token');
      
      // Dispatch a custom event that the AuthProvider can listen for.
      // This decouples the API service from the UI/router logic.
      window.dispatchEvent(new Event('auth-error'));
    }
    return Promise.reject(error);
  }
);

/**
 * AI Dashboard Service Factory
 * 
 * Creates AI dashboard methods following the factory pattern from development principles.
 * Extends the existing API service rather than creating a new service class.
 * 
 * @author AI Development Team
 * @since 2025-08-22
 */

import { 
  DailyLearningPlan, 
  ContentRecommendation, 
  AIGenerationJob, 
  ContentGenerationRequest,
  APIResponse 
} from '../types/AIDashboard.js';

/**
 * Extended API instance interface for type safety
 * Ensures TypeScript knows about the aiDashboard methods
 */
interface ExtendedApiInstance {
  aiDashboard: {
    getDailyPlan(): Promise<DailyLearningPlan>;
    generateContent(request: ContentGenerationRequest): Promise<{ jobId: string }>;
    getJobStatus(jobId: string): Promise<AIGenerationJob>;
    getRecommendations(): Promise<ContentRecommendation[]>;
    listJobs(options?: { status?: string; limit?: number; offset?: number }): Promise<AIGenerationJob[]>;
    cancelJob(jobId: string): Promise<void>;
    getDashboardAnalytics(timeRange?: '7d' | '30d' | '90d'): Promise<any>;
    generateBatchContent(
      requests: ContentGenerationRequest[],
      options?: { priority?: 'low' | 'normal' | 'high'; maxConcurrent?: number }
    ): Promise<{ batchId: string; jobIds: string[] }>;
    getAIPreferences(): Promise<any>;
    updateAIPreferences(preferences: any): Promise<any>;
  };
}

/**
 * Factory function to create AI dashboard service methods
 * Following the factory pattern from development principles
 */
function createAIDashboardService() {
  return {
    /**
     * Get personalized daily learning plan for the authenticated user
     * 
     * @returns Promise<DailyLearningPlan> - AI-generated daily learning plan
     * @throws {Error} - When API request fails or user is not authenticated
     */
    getDailyPlan: async (): Promise<DailyLearningPlan> => {
      try {
        const response = await api.get('/ai/dashboard/daily-plan');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch daily learning plan:', error);
        throw new Error('Unable to load your daily learning plan. Please try again.');
      }
    },

    /**
     * Generate AI content with immediate job ID return for polling
     * 
     * @param request - Content generation parameters
     * @returns Promise<{jobId: string}> - Job ID for status tracking
     * @throws {Error} - When content generation request fails
     */
    generateContent: async (request: ContentGenerationRequest): Promise<{ jobId: string }> => {
      try {
        const response = await api.post('/ai/generate', {
          contentType: request.contentType,
          topic: request.topic,
          difficulty: request.difficulty || 'A1',
          estimatedTime: request.estimatedTime || 15,
          focusAreas: request.focusAreas || [],
          context: request.context || {}
        });
        return response.data;
      } catch (error) {
        console.error('Failed to generate content:', error);
        throw new Error('Unable to start content generation. Please try again.');
      }
    },

    /**
     * Get job status for polling with enhanced error handling
     * 
     * @param jobId - Unique job identifier
     * @returns Promise<AIGenerationJob> - Current job status and details
     * @throws {Error} - When job status request fails or job not found
     */
    getJobStatus: async (jobId: string): Promise<AIGenerationJob> => {
      if (!jobId || typeof jobId !== 'string') {
        throw new Error('Invalid job ID provided');
      }

      try {
        const response = await api.get(`/ai/generate/status/${jobId}`);
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          throw new Error(`Job ${jobId} not found. It may have expired or been cancelled.`);
        }
        console.error(`Failed to get status for job ${jobId}:`, error);
        throw new Error('Unable to check job status. Please try again.');
      }
    },

    /**
     * Get personalized content recommendations based on user progress
     * 
     * @returns Promise<ContentRecommendation[]> - Array of AI-generated recommendations
     * @throws {Error} - When recommendations request fails
     */
    getRecommendations: async (): Promise<ContentRecommendation[]> => {
      try {
        const response = await api.get('/ai/dashboard/recommendations');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        throw new Error('Unable to load personalized recommendations. Please try again.');
      }
    },

    /**
     * List all active and recent jobs for the authenticated user
     * 
     * @param options - Optional filtering parameters
     * @returns Promise<AIGenerationJob[]> - Array of user's jobs
     * @throws {Error} - When jobs list request fails
     */
    listJobs: async (options?: { 
      status?: string; 
      limit?: number; 
      offset?: number 
    }): Promise<AIGenerationJob[]> => {
      try {
        const params = new URLSearchParams();
        if (options?.status) params.append('status', options.status);
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.offset) params.append('offset', options.offset.toString());

        const response = await api.get(`/ai/jobs${params.toString() ? `?${params.toString()}` : ''}`);
        
        // Handle both direct array and wrapped response formats
        return Array.isArray(response.data) ? response.data : response.data.data || [];
      } catch (error) {
        console.error('Failed to fetch jobs list:', error);
        throw new Error('Unable to load your content generation jobs. Please try again.');
      }
    },

    /**
     * Cancel a pending or processing job
     * 
     * @param jobId - Unique job identifier to cancel
     * @returns Promise<void> - Resolves when job is successfully cancelled
     * @throws {Error} - When job cancellation fails
     */
    cancelJob: async (jobId: string): Promise<void> => {
      if (!jobId || typeof jobId !== 'string') {
        throw new Error('Invalid job ID provided');
      }

      try {
        await api.delete(`/ai/jobs/${jobId}`);
      } catch (error: any) {
        if (error.response?.status === 404) {
          throw new Error(`Job ${jobId} not found or already completed.`);
        }
        if (error.response?.status === 409) {
          throw new Error(`Job ${jobId} cannot be cancelled as it's already completed.`);
        }
        console.error(`Failed to cancel job ${jobId}:`, error);
        throw new Error('Unable to cancel the job. Please try again.');
      }
    },

    /**
     * Get detailed analytics for the user's AI dashboard usage
     * 
     * @param timeRange - Optional time range for analytics (default: 7 days)
     * @returns Promise<any> - Dashboard analytics data
     * @throws {Error} - When analytics request fails
     */
    getDashboardAnalytics: async (timeRange?: '7d' | '30d' | '90d'): Promise<any> => {
      try {
        const params = timeRange ? `?timeRange=${timeRange}` : '';
        const response = await api.get(`/ai/dashboard/analytics${params}`);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch dashboard analytics:', error);
        // Don't throw for analytics - it's not critical functionality
        return null;
      }
    },

    /**
     * Batch content generation for multiple requests
     * 
     * @param requests - Array of content generation requests
     * @param options - Batch processing options
     * @returns Promise<{batchId: string, jobIds: string[]}> - Batch tracking information
     * @throws {Error} - When batch generation fails
     */
    generateBatchContent: async (
      requests: ContentGenerationRequest[],
      options?: { priority?: 'low' | 'normal' | 'high'; maxConcurrent?: number }
    ): Promise<{ batchId: string; jobIds: string[] }> => {
      if (!Array.isArray(requests) || requests.length === 0) {
        throw new Error('Invalid requests array provided');
      }

      try {
        const response = await api.post('/ai/generate/batch', {
          requests,
          options: options || {}
        });
        return response.data;
      } catch (error) {
        console.error('Failed to generate batch content:', error);
        throw new Error('Unable to start batch content generation. Please try again.');
      }
    },

    /**
     * Get user preferences for AI content generation
     * 
     * @returns Promise<any> - User's AI preferences
     * @throws {Error} - When preferences request fails
     */
    getAIPreferences: async (): Promise<any> => {
      try {
        const response = await api.get('/ai/preferences');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch AI preferences:', error);
        // Return default preferences if request fails
        return {
          defaultDifficulty: 'A1',
          preferredContentTypes: ['lesson', 'vocabulary_drill'],
          dailyLearningTime: 30,
          focusAreas: []
        };
      }
    },

    /**
     * Update user preferences for AI content generation
     * 
     * @param preferences - Updated preferences object
     * @returns Promise<any> - Updated preferences
     * @throws {Error} - When preferences update fails
     */
    updateAIPreferences: async (preferences: any): Promise<any> => {
      try {
        const response = await api.put('/ai/preferences', preferences);
        return response.data;
      } catch (error) {
        console.error('Failed to update AI preferences:', error);
        throw new Error('Unable to save your preferences. Please try again.');
      }
    }
  };
}

// Create and attach AI dashboard methods to the existing API instance
const aiDashboardMethods = createAIDashboardService();

// Extend the existing api object with AI dashboard methods
// This follows the established pattern of extending rather than replacing
const extendedApi = Object.assign(api, { aiDashboard: aiDashboardMethods }) as typeof api & ExtendedApiInstance;

export default extendedApi;
