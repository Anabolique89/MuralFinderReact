/**
 * API Configuration Utilities
 * Centralized configuration for API URLs using environment variables
 */

// Get the base API URL from environment variables
export const getApiBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
};

// Get the base server URL (without /api) for file URLs
export const getServerBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  // Remove /api from the end if it exists
  const serverUrl = apiUrl.replace(/\/api\/?$/, '');
  return serverUrl;
};

// Helper function to construct full file URLs
export const getFileUrl = (relativePath) => {
  if (!relativePath) return null;
  
  const serverUrl = getServerBaseUrl();
  const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  
  return `${serverUrl}${cleanPath}`;
};

// Helper function for auth URLs
export const getAuthUrl = (provider) => {
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}auth/${provider}`;
};

// Export the URLs for backward compatibility
export const API_BASE_URL = getApiBaseUrl();
export const SERVER_BASE_URL = getServerBaseUrl();
