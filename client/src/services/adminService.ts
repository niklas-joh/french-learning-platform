/**
 * Service layer for admin APIs.
 */
import api from './api';
import axios, { AxiosError } from 'axios';
import { Topic } from '../types/Topic';
import { Content } from '../types/Content';

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
    // No need to manually get/set token, the central 'api' service interceptor handles it
    const response = await api.get<AnalyticsSummary>('/admin/analytics/summary');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<AdminErrorResponse>;
    if (axiosError.response && axiosError.response.data) {
      throw axiosError.response.data;
    }
    // TODO: surface network connectivity issues to the user
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
    const response = await api.get<Topic[]>('/admin/topics');
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
    const response = await api.post<Topic>('/admin/topics', topicData);
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
    const response = await api.put<Topic>(`/admin/topics/${topicId}`, topicData);
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
    await api.delete(`/admin/topics/${topicId}`);
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
  description?: string;
}

/**
 * Fetches all content types from the backend.
 * @returns A promise that resolves with an array of content types.
 */
export const getContentTypes = async (): Promise<ContentType[]> => {
  try {
    const response = await api.get<ContentType[]>('/admin/content-types');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AdminErrorResponse;
    }
    throw { message: 'An unexpected error occurred while fetching content types.' } as AdminErrorResponse;
  }
};

export const createContentType = async (data: { name: string; description?: string }): Promise<ContentType> => {
  try {
    const response = await api.post<ContentType>('/admin/content-types', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AdminErrorResponse;
    }
    throw { message: 'An unexpected error occurred while creating content type.' } as AdminErrorResponse;
  }
};

export const updateContentType = async (id: number, data: { name: string; description?: string }): Promise<ContentType> => {
  try {
    const response = await api.put<ContentType>(`/admin/content-types/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AdminErrorResponse;
    }
    throw { message: 'An unexpected error occurred while updating content type.' } as AdminErrorResponse;
  }
};

export const deleteContentType = async (id: number): Promise<void> => {
  try {
    await api.delete(`/admin/content-types/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AdminErrorResponse;
    }
    throw { message: 'An unexpected error occurred while deleting content type.' } as AdminErrorResponse;
  }
};

/**
 * Fetches all content items from the backend.
 * @returns A promise that resolves with an array of content items.
 */
export const getContentItems = async (): Promise<Content[]> => {
  try {
    const response = await api.get<Content[]>('/admin/content');
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
    const response = await api.post<Content>('/admin/content', contentData);
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
    const response = await api.put<Content>(`/admin/content/${contentId}`, contentData);
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
    await api.delete(`/admin/content/${contentId}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AdminErrorResponse;
    }
    throw { message: 'An unexpected error occurred while deleting the content item.' } as AdminErrorResponse;
  }
};

// =============================================================================
// ASSIGNMENT MANAGEMENT
// =============================================================================

export interface UserContentAssignment {
  id: number;
  user_id: number;
  content_id: number;
  assigned_at: string;
  status: string;
}

export interface UserContentAssignmentWithContent extends UserContentAssignment {
  content: Partial<Content> & { name: string; type: string; };
}

/**
 * Assigns a piece of content to a user.
 * @param userId - The ID of the user.
 * @param contentId - The ID of the content.
 * @returns A promise that resolves with the new assignment.
 */
export const assignContentToUser = async (userId: number, contentId: number): Promise<UserContentAssignment> => {
  try {
    const response = await api.post<UserContentAssignment>('/admin/assignments', { userId, contentId });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AdminErrorResponse;
    }
    throw { message: 'An unexpected error occurred while assigning content.' } as AdminErrorResponse;
  }
};

/**
 * Fetches all content assignments for a specific user.
 * @param userId - The ID of the user.
 * @returns A promise that resolves with an array of assignments.
 */
export const getAssignmentsForUser = async (userId: number): Promise<UserContentAssignmentWithContent[]> => {
  try {
    const response = await api.get<UserContentAssignmentWithContent[]>(`/admin/assignments/user/${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AdminErrorResponse;
    }
    throw { message: 'An unexpected error occurred while fetching assignments.' } as AdminErrorResponse;
  }
};

/**
 * Unassigns a piece of content from a user.
 * @param assignmentId - The ID of the assignment to delete.
 * @returns A promise that resolves when the assignment is deleted.
 */
export const unassignContentFromUser = async (assignmentId: number): Promise<void> => {
  try {
    await api.delete(`/admin/assignments/${assignmentId}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as AdminErrorResponse;
    }
    throw { message: 'An unexpected error occurred while unassigning content.' } as AdminErrorResponse;
  }
};
