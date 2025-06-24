import axios from 'axios';
import { Topic } from '../types/Topic';

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

export const getTopics = async (): Promise<Topic[]> => {
  const token = localStorage.getItem('authToken');
  const response = await apiClient.get('/content/topics', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const getContentForTopic = async (topicId: number | string) => {
  const response = await apiClient.get(`/content/topics/${topicId}/content`);
  return response.data;
};

export const getContentById = async (id: number | string) => {
  const response = await apiClient.get(`/content/${id}`);
  return response.data;
};

export const getAssignedContent = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No token found');
  }
  const response = await apiClient.get('/users/me/assignments', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default apiClient;
