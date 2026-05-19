import axios from 'axios';

/**
 * apiClient.ts
 * A simple reusable axios instance that handles authentication tokens
 * and provides friendly error messages.
 */

const baseURL = '/api/proxy';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the token to every request automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the domain is unreachable or network error
    if (!error.response) {
      console.error('Network Error: Please check if the API server is reachable.');
      return Promise.reject({
        message: 'The medical API is currently unreachable. Please check your connection.',
      });
    }

    // Handle Unauthorized errors (e.g. expired token)
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error.response.data || { message: 'Something went wrong. Please try again.' });
  }
);

export default apiClient;
