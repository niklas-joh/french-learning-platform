import axios from 'axios';

// Create a dedicated Axios instance for our API
const api = axios.create({
  baseURL: '/api', // Adjust this if your API is hosted elsewhere
});

/**
 * Request Interceptor
 *
 * This interceptor runs before each request is sent.
 * Its purpose is to dynamically add the Authorization header
 * to every API request, ensuring the user is authenticated.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // This part handles errors that occur when setting up the request.
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 *
 * This interceptor runs after a response is received.
 * Its primary purpose is to globally handle authentication errors (401).
 * If a 401 is detected, it means the user's session is no longer valid.
 * We then clear the local session data and redirect to the login page.
 *
 * A custom event 'auth-error' is dispatched to allow the AuthContext
 * to react and update its state, ensuring a clean logout.
 */
api.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it.
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized: Token is invalid or expired.
      console.error("Authentication error: Token is invalid or expired. Logging out.");
      localStorage.removeItem('token');
      
      // Dispatch a custom event that the AuthProvider can listen for.
      // This decouples the API service from the UI/router logic.
      window.dispatchEvent(new Event('auth-error'));
    }
    return Promise.reject(error);
  }
);

export default api;
