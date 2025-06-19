import apiClient from './authService'; // Reusing the configured Axios instance
import axios from 'axios'; // For type checking like axios.isAxiosError
import { Topic } from '../components/admin/TopicManager'; // Import Topic type
import { Content } from '../components/admin/ContentManager'; // Import Content type

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

// =============================================================================
// TOPIC MANAGEMENT
// =============================================================================

/**
 * Fetches all topics from the backend.
 * @returns A promise that resolves with an array of topics.
 */
export const getTopics = async (): Promise<Topic[]> => {
  // Placeholder implementation. This will be replaced with an actual API call.
  console.warn('getTopics is using placeholder data.');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Subjunctive Present', category: 'Grammar', active: true },
        { id: 2, name: 'Passé Composé vs. Imparfait', category: 'Grammar', active: true },
        { id: 3, name: 'Common Idioms', category: 'Vocabulary', active: false },
      ]);
    }, 500);
  });
  // try {
  //   const response = await apiClient.get<Topic[]>('/admin/topics');
  //   return response.data;
  // } catch (error) {
  //   if (axios.isAxiosError(error) && error.response) {
  //     throw error.response.data as ErrorResponse;
  //   }
  //   throw { message: 'An unexpected error occurred while fetching topics.' } as ErrorResponse;
  // }
};

/**
 * Creates a new topic.
 * @param topicData - The data for the new topic.
 * @returns A promise that resolves with the created topic.
 */
export const createTopic = async (topicData: Omit<Topic, 'id'>): Promise<Topic> => {
  console.warn('createTopic is a placeholder and does not send data to the backend.');
  // Placeholder: In a real implementation, you would post to the backend.
  return new Promise(resolve => setTimeout(() => resolve({ id: Math.random(), ...topicData }), 500));
  // try {
  //   const response = await apiClient.post<Topic>('/admin/topics', topicData);
  //   return response.data;
  // } catch (error) {
  //   if (axios.isAxiosError(error) && error.response) {
  //     throw error.response.data as ErrorResponse;
  //   }
  //   throw { message: 'An unexpected error occurred while creating the topic.' } as ErrorResponse;
  // }
};

/**
 * Updates an existing topic.
 * @param topicId - The ID of the topic to update.
 * @param topicData - The new data for the topic.
 * @returns A promise that resolves with the updated topic.
 */
export const updateTopic = async (topicId: number, topicData: Partial<Topic>): Promise<Topic> => {
  console.warn('updateTopic is a placeholder and does not send data to the backend.');
  // Placeholder: In a real implementation, you would put/patch to the backend.
  return new Promise(resolve => setTimeout(() => resolve({ id: topicId, name: 'Updated Topic', ...topicData } as Topic), 500));
  // try {
  //   const response = await apiClient.put<Topic>(`/admin/topics/${topicId}`, topicData);
  //   return response.data;
  // } catch (error) {
  //   if (axios.isAxiosError(error) && error.response) {
  //     throw error.response.data as ErrorResponse;
  //   }
  //   throw { message: 'An unexpected error occurred while updating the topic.' } as ErrorResponse;
  // }
};

/**
 * Deletes a topic.
 * @param topicId - The ID of the topic to delete.
 * @returns A promise that resolves when the topic is deleted.
 */
export const deleteTopic = async (topicId: number): Promise<void> => {
  console.warn('deleteTopic is a placeholder and does not send data to the backend.');
  // Placeholder: In a real implementation, you would delete from the backend.
  return new Promise(resolve => setTimeout(resolve, 500));
  // try {
  //   await apiClient.delete(`/admin/topics/${topicId}`);
  // } catch (error) {
  //   if (axios.isAxiosError(error) && error.response) {
  //     throw error.response.data as ErrorResponse;
  //   }
  //   throw { message: 'An unexpected error occurred while deleting the topic.' } as ErrorResponse;
  // }
};

// =============================================================================
// CONTENT MANAGEMENT
// =============================================================================

/**
 * Fetches all content items from the backend.
 * @returns A promise that resolves with an array of content items.
 */
export const getContentItems = async (): Promise<Content[]> => {
  // Placeholder implementation.
  console.warn('getContentItems is using placeholder data.');
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, topicId: 1, type: 'multiple-choice', questionData: { q: 'Which is correct?' }, active: true },
        { id: 2, topicId: 2, type: 'fill-in-the-blank', questionData: { q: 'Je ___ (être) content.' }, active: true },
      ]);
    }, 500);
  });
};

/**
 * Creates a new content item.
 * @param contentData - The data for the new content item.
 * @returns A promise that resolves with the created content item.
 */
export const createContentItem = async (contentData: Omit<Content, 'id'>): Promise<Content> => {
  console.warn('createContentItem is a placeholder.');
  return new Promise(resolve => setTimeout(() => resolve({ id: Math.random(), ...contentData }), 500));
};

/**
 * Updates an existing content item.
 * @param contentId - The ID of the content item to update.
 * @param contentData - The new data for the content item.
 * @returns A promise that resolves with the updated content item.
 */
export const updateContentItem = async (contentId: number, contentData: Partial<Content>): Promise<Content> => {
  console.warn('updateContentItem is a placeholder.');
  return new Promise(resolve => setTimeout(() => resolve({ id: contentId, type: 'Updated', ...contentData } as Content), 500));
};

/**
 * Deletes a content item.
 * @param contentId - The ID of the content item to delete.
 * @returns A promise that resolves when the content item is deleted.
 */
export const deleteContentItem = async (contentId: number): Promise<void> => {
  console.warn('deleteContentItem is a placeholder.');
  return new Promise(resolve => setTimeout(resolve, 500));
};
