import { ClientLearningPath } from '../types/LearningPath';

const API_BASE_URL = '/api';

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
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token not found.');
  }

  const response = await fetch(`${API_BASE_URL}/learning-paths/${pathId}/user-view`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch learning path' }));
    throw new Error(errorData.message || 'An unknown error occurred');
  }

  return response.json();
};
