import api from './api';
import { Topic } from '../types/Topic';

// Note: This service is being refactored to use the central 'api' instance.
// The routes are now pointing to the /admin namespace as per the backend routing structure.

export const fetchSampleQuiz = async () => {
  // Assuming this is a public, non-admin route. If it's admin, it needs /admin prefix.
  // This route does not seem to exist in the new structure, commenting out.
  // const response = await api.get('/content/sample-quiz');
  // return response.data;
  console.warn('fetchSampleQuiz is deprecated and does not exist in v1 API.');
  return Promise.resolve(null);
};

export const getTopics = async (): Promise<Topic[]> => {
  // The central api instance handles the token automatically.
  const response = await api.get<Topic[]>('/admin/topics');
  return response.data;
};

export const getTopicById = async (topicId: string): Promise<Topic> => {
  const response = await api.get<Topic>(`/admin/topics/${topicId}`);
  return response.data;
};

export const getContentForTopic = async (topicId: number | string) => {
  // This specific route /admin/topics/:id/content does not exist.
  // The correct way is likely to get all content and filter by topicId on the client,
  // or to add a query param to the /admin/content route.
  // For now, marking as deprecated.
  console.warn('getContentForTopic is deprecated. Use getContentItems and filter by topicId.');
  // As a fallback, this might be the intended route:
  const response = await api.get(`/admin/content?topicId=${topicId}`);
  return response.data;
};

export const getContentById = async (id: number | string) => {
  const response = await api.get(`/admin/content/${id}`);
  return response.data;
};

export const getAssignedContent = async () => {
  // This is a user-specific route, not a content route.
  // It should ideally be in userService.ts, but we'll fix the URL here for now.
  const response = await api.get('/users/me/assignments');
  return response.data;
};

// Exporting the default apiClient is no longer necessary as we use the named exports
// and the central 'api' instance.
// export default apiClient;
