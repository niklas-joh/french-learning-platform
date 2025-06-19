import apiClient from './authService'; // Reusing the configured Axios instance
import axios from 'axios'; // For type checking like axios.isAxiosError

// Interface for the analytics data, matching the backend's AnalyticsSummary
export interface AdminAnalyticsData {
  totalUsers: number;
  usersByRole: { role: string; count: number }[];
  totalContentItems: number;
}

interface ErrorResponse {
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Fetches the admin analytics summary from the backend.
 * @returns A promise that resolves with the admin analytics data.
 */
export const getAdminAnalytics = async (): Promise<AdminAnalyticsData> => {
  try {
    // The apiClient already has an interceptor to include the auth token.
    const response = await apiClient.get<AdminAnalyticsData>('/admin/analytics');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Log the detailed error for debugging on the client-side if needed
      console.error('Error fetching admin analytics:', error.response.data);
      throw error.response.data as ErrorResponse;
    }
    console.error('Unexpected error fetching admin analytics:', error);
    throw { message: 'An unexpected error occurred while fetching admin analytics.' } as ErrorResponse;
  }
};
