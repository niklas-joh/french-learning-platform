import apiClient from './authService'; // Use the configured axios client
import { AxiosError } from 'axios';

export interface AnalyticsSummary {
  totalUsers: number;
  usersByRole: { role: string; count: number }[];
  totalContentItems: number;
}

interface AdminErrorResponse { // Consistent error response type
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export const getAdminAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  try {
    // No need to manually get/set token, axios interceptor in authService handles it
    const response = await apiClient.get<AnalyticsSummary>('/admin/analytics/summary');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<AdminErrorResponse>;
    if (axiosError.response && axiosError.response.data) {
      throw axiosError.response.data;
    }
    throw { message: 'An unexpected error occurred while fetching admin analytics.' } as AdminErrorResponse;
  }
};
