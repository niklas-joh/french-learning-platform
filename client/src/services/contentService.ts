import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchSampleQuiz = async () => {
  const response = await apiClient.get('/content/sample-quiz');
  return response.data;
};

export const getTopics = async () => {
  const response = await apiClient.get('/content/topics');
  return response.data;
};

export const getContentForTopic = async (topicId: number | string) => {
  const response = await apiClient.get(`/content/topics/${topicId}/content`);
  return response.data;
};

export default apiClient;
