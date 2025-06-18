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

// Define a basic Topic type
// This should ideally match the structure returned by the /api/topics endpoint
export interface Topic {
  id: number; // or string, depending on backend
  name: string;
  description?: string; // Optional description
  // Add other relevant fields if known, e.g., difficulty, number of questions
}

export const getTopics = async (): Promise<Topic[]> => {
  // Ensure the token is included if the endpoint is protected
  const token = localStorage.getItem('token');
  const response = await apiClient.get('/content/topics', { // Corrected endpoint
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export default apiClient;
