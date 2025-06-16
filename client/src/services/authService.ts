import axios from 'axios';

// Define the base URL for the API. This should ideally come from an environment variable.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define types for request payloads and responses (optional but good practice)
// These should align with your backend's expected request/response structures.

interface LoginPayload {
  email: string;
  password?: string;
}

interface RegisterPayload {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
    // other user properties
  };
  message?: string; // Optional message from backend
}

interface ErrorResponse {
  message: string;
  errors?: Array<{ field: string; message: string }>; // For validation errors
}

/**
 * Makes a login request to the backend.
 * @param credentials - The user's login credentials.
 * @returns A promise that resolves with the authentication response.
 */
export const login = async (credentials: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    // Store the token if needed (e.g., in localStorage)
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ErrorResponse;
    }
    throw { message: 'An unexpected error occurred during login.' } as ErrorResponse;
  }
};

/**
 * Makes a registration request to the backend.
 * @param userData - The user's registration data.
 * @returns A promise that resolves with the authentication response.
 */
export const register = async (userData: RegisterPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    // Store the token if needed (e.g., in localStorage)
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ErrorResponse;
    }
    throw { message: 'An unexpected error occurred during registration.' } as ErrorResponse;
  }
};

/**
 * Logs out the current user by removing the token.
 */
export const logout = (): void => {
  localStorage.removeItem('authToken');
  // Optionally, notify the backend about logout if needed
};

/**
 * Gets the current authentication token from localStorage.
 * @returns The auth token or null if not found.
 */
export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Checks if a user is currently authenticated.
 * @returns True if a token exists, false otherwise.
 */
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

// You can also add an interceptor to automatically include the auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
