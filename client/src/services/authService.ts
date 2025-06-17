import axios from 'axios';

// Define the base URL for the API. This should ideally come from an environment variable.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define types for request payloads and responses (optional but good practice)
// These should align with your backend's expected request/response structures.

export interface UserProfileData { // Exporting for use in components
  id: number;
  email: string; // email is part of UserApplicationData from backend
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  // Add other properties if your backend /users/me returns more (e.g., createdAt, preferences)
}

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
    firstName?: string | null; // Align with backend UserApplicationData
    lastName?: string | null;  // Align with backend UserApplicationData
    role: string;             // Add role
    // other user properties if any (e.g., createdAt, preferences)
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
    if (response.data.token && response.data.user) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user)); // Store user object
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
    if (response.data.token && response.data.user) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user)); // Store user object
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
  localStorage.removeItem('currentUser'); // Remove user object on logout
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

/**
 * Gets the current user object from localStorage.
 * @returns The user object or null if not found.
 */
export const getCurrentUser = (): UserProfileData | null => { // Use UserProfileData as it's the shape of user data
  const userStr = localStorage.getItem('currentUser');
  if (userStr) {
    try {
      return JSON.parse(userStr) as UserProfileData;
    } catch (e) {
      console.error("Error parsing current user from localStorage", e);
      localStorage.removeItem('currentUser'); // Clear corrupted data
      return null;
    }
  }
  return null;
};

/**
 * Fetches the current user's profile from the backend.
 * @returns A promise that resolves with the user's profile data.
 */
export const getUserProfile = async (): Promise<UserProfileData> => {
  try {
    const response = await apiClient.get<UserProfileData>('/users/me');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Log the detailed error for debugging on the client-side if needed
      console.error('Error fetching user profile:', error.response.data);
      throw error.response.data as ErrorResponse;
    }
    console.error('Unexpected error fetching user profile:', error);
    throw { message: 'An unexpected error occurred while fetching your profile.' } as ErrorResponse;
  }
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
