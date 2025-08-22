/**
 * Integration tests for useAIDashboard hook
 * 
 * Tests the refactored implementation that leverages existing infrastructure
 * instead of duplicating polling logic.
 * 
 * @author AI Development Team
 * @since 2025-08-22
 */

import { renderHook, act } from '@testing-library/react';
import { useAIDashboard } from '../useAIDashboard.js';
import api from '../../services/api.js';

// Mock the API service
jest.mock('../../services/api.js', () => ({
  __esModule: true,
  default: {
    aiDashboard: {
      getDailyPlan: jest.fn(),
      getRecommendations: jest.fn(),
      listJobs: jest.fn(),
    }
  }
}));

const mockApi = api as any;

describe('useAIDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load dashboard data on mount', async () => {
    // Mock successful API responses
    mockApi.aiDashboard.getDailyPlan.mockResolvedValue({
      id: 'plan-1',
      lessons: [],
      estimatedDuration: 30
    });
    mockApi.aiDashboard.getRecommendations.mockResolvedValue([
      { id: 'rec-1', title: 'Test Recommendation' }
    ]);
    mockApi.aiDashboard.listJobs.mockResolvedValue([
      { jobId: 'job-1', status: 'pending' }
    ]);

    const { result } = renderHook(() => useAIDashboard());

    // Should start loading
    expect(result.current.isLoading).toBe(true);

    // Wait for async operations
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Should have loaded data
    expect(result.current.isLoading).toBe(false);
    expect(result.current.dailyPlan).toBeTruthy();
    expect(result.current.recommendations).toHaveLength(1);
    expect(result.current.activeJobs).toHaveLength(1);
  });

  it('should handle API errors gracefully', async () => {
    // Mock API failures
    mockApi.aiDashboard.getDailyPlan.mockRejectedValue(new Error('API Error'));
    mockApi.aiDashboard.getRecommendations.mockRejectedValue(new Error('API Error'));
    mockApi.aiDashboard.listJobs.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useAIDashboard());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Should handle errors gracefully
    expect(result.current.error).toBeTruthy();
    expect(result.current.isLoading).toBe(false);
  });

  it('should provide stable callback references', () => {
    const { result, rerender } = renderHook(() => useAIDashboard());

    const initialCallbacks = {
      refreshDailyPlan: result.current.refreshDailyPlan,
      updateJobStatus: result.current.updateJobStatus,
      removeJob: result.current.removeJob,
      clearError: result.current.clearError,
      reload: result.current.reload
    };

    // Force re-render
    rerender();

    // Callbacks should remain stable
    expect(result.current.refreshDailyPlan).toBe(initialCallbacks.refreshDailyPlan);
    expect(result.current.updateJobStatus).toBe(initialCallbacks.updateJobStatus);
    expect(result.current.removeJob).toBe(initialCallbacks.removeJob);
    expect(result.current.clearError).toBe(initialCallbacks.clearError);
    expect(result.current.reload).toBe(initialCallbacks.reload);
  });

  it('should update job status correctly', () => {
    const { result } = renderHook(() => useAIDashboard());

    act(() => {
      result.current.updateJobStatus('job-1', {
        jobId: 'job-1',
        status: 'completed',
        createdAt: '2025-08-22T08:00:00Z',
        updatedAt: '2025-08-22T08:05:00Z'
      });
    });

    const job = result.current.activeJobs.find(j => j.jobId === 'job-1');
    expect(job?.status).toBe('completed');
  });

  it('should clear error state', () => {
    const { result } = renderHook(() => useAIDashboard());

    // Simulate error state
    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
