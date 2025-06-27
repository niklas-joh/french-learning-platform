import api from './api';
import { ClientLearningPath } from '../types/LearningPath';

// TODO: Refactor this to support paginated or per-unit data fetching.
// Currently, it fetches the entire learning path, which is not scalable for
// very large paths. The backend should be updated to provide units on demand.

/**
 * Fetches the complete learning path structure with user-specific progress.
 * @param pathId The ID of the learning path to fetch.
 * @returns A promise that resolves to the ClientLearningPath object.
 * @throws Will throw an error if the network request fails or the API returns an error.
 */
export const fetchLearningPath = async (pathId: number): Promise<ClientLearningPath> => {
  try {
    // The '/learning' prefix corresponds to how learningRoutes is registered in app.ts
    const response = await api.get<ClientLearningPath>(`/learning/learning-paths/${pathId}/user-view`);
    return response.data;
  } catch (error) {
    // The error will be handled by the global interceptor in api.ts,
    // but we can re-throw it if specific components need to react to it.
    console.error('Failed to fetch learning path:', error);
    throw error;
  }
};
