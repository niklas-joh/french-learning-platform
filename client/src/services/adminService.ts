import apiClient from './authService'; // Reusing the configured Axios instance
import axios, { AxiosError } from 'axios'; // For type checking like axios.isAxiosError
import { Topic } from '../types/Topic'; // Import Topic type
import { Content } from '../types/Content'; // Import Content type

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

// =============================================================================
// TOPIC MANAGEMENT
// =============================================================================

/**
 * Fetches all topics from the backend.
 * @returns A promise that resolves with an array of topics.
 */
export const getTopics = async (): Promise<Topic[]> => {
  try {
    const response = await apiClient.get<Topic[]>('/admin/topics');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AdminErrorResponse;
    }
    throw { message: 'An unexpected error occurred while fetching topics.' } as AdminErrorResponse;
  }
};

/**
 * Creates a new topic.
 * @param topicData - The data for the new topic.
 * @returns A promise that resolves with the created topic.
 */
export const createTopic = async (topicData: Omit<Topic, 'id'>): Promise<Topic> => {
  try {
    const response = await apiClient.post<Topic>('/admin/topics', topicData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AdminErrorResponse;
    }
    throw { message: 'An unexpected error occurred while creating the topic.' } as AdminErrorResponse;
  }
};

/**
 * Updates an existing topic.
 * @param topicId - The ID of the topic to update.
 * @param topicData - The new data for the topic.
 * @returns A promise that resolves with the updated topic.
 */
export const updateTopic = async (topicId: number, topicData: Partial<Topic>): Promise<Topic> => {
  try {
    const response = await apiClient.put<Topic>(`/admin/topics/${topicId}`, topicData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AdminErrorResponse;
    }
    throw { message: 'An unexpected error occurred while updating the topic.' } as AdminErrorResponse;
  }
};

/**
 * Deletes a topic.
 * @param topicId - The ID of the topic to delete.
 * @returns A promise that resolves when the topic is deleted.
 */
export const deleteTopic = async (topicId: number): Promise<void> => {
  try {
    await apiClient.delete(`/admin/topics/${topicId}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AdminErrorResponse;
    }
    throw { message: 'An unexpected error occurred while deleting the topic.' } as AdminErrorResponse;
  }
};

// =============================================================================
// CONTENT MANAGEMENT
// =============================================================================

export interface ContentType {
  id: number;
  name: string;
}

/**
 * Fetches all content types from the backend.
 * @returns A promise that resolves with an array of content types.
 */
export const getContentTypes = async (): Promise<ContentType[]> => {
  try {
    const response = await apiClient.get<ContentType[]>('/admin/content-types');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AdminErrorResponse;
    }
    throw { message: 'An unexpected error occurred while fetching content types.' } as AdminErrorResponse;
  }
};

/**
 * Fetches all content items from the backend.
 * @returns A promise that resolves with an array of content items.
 */
export const getContentItems = async (): Promise<Content[]> => {
  try {
    const response = await apiClient.get<Content[]>('/admin/content');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AdminErrorResponse;
    }
    throw { message: 'An unexpected error occurred while fetching content.' } as AdminErrorResponse;
  }
};

/**
 * Creates a new content item.
 * @param contentData - The data for the new content item.
 * @returns A promise that resolves with the created content item.
 */
export const createContentItem = async (contentData: Omit<Content, 'id'>): Promise<Content> => {
  try {
    const response = await apiClient.post<Content>('/admin/content', contentData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AdminErrorResponse;
    }
    throw { message: 'An unexpected error occurred while creating the content item.' } as AdminErrorResponse;
  }
};

/**
 * Updates an existing content item.
 * @param contentId - The ID of the content item to update.
 * @param contentData - The new data for the content item.
 * @returns A promise that resolves with the updated content item.
 */
export const updateContentItem = async (contentId: number, contentData: Partial<Content>): Promise<Content> => {
  try {
    const response = await apiClient.put<Content>(`/admin/content/${contentId}`, contentData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AdminErrorResponse;
    }
    throw { message: 'An unexpected error occurred while updating the content item.' } as AdminErrorResponse;
  }
};

/**
 * Deletes a content item.
 * @param contentId - The ID of the content item to delete.
 * @returns A promise that resolves when the content item is deleted.
 */
export const deleteContentItem = async (contentId: number): Promise<void> => {
  try {
    await apiClient.delete(`/admin/content/${contentId}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AdminErrorResponse;
    }
    throw { message: 'An unexpected error occurred while deleting the content item.' } as AdminErrorResponse;
  }
};
