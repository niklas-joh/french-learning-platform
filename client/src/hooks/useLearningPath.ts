import { useState, useEffect } from 'react';
import { ClientLearningPath } from '../types/LearningPath';
import { fetchLearningPath } from '../services/learningPathService';

// TODO: This custom hook should be replaced with a robust server-state management
// library like TanStack Query (React Query) in the future. This would provide
// caching, automatic refetching, request deduplication, and a more resilient
// data fetching strategy across the application.

interface UseLearningPathReturn {
  data: ClientLearningPath | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * A custom hook to fetch and manage the state for a learning path.
 * @param pathId The ID of the learning path to fetch.
 */
export const useLearningPath = (pathId: number): UseLearningPathReturn => {
  const [data, setData] = useState<ClientLearningPath | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const learningPathData = await fetchLearningPath(pathId);
      setData(learningPathData);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred while fetching the learning path.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pathId]);

  return { data, isLoading, error, refetch: fetchData };
};
