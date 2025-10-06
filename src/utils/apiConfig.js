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
  if (!relativePath) {
    console.log('getFileUrl: No relativePath provided');
    return null;
  }

  // If it's already a full URL, return it as is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    console.log('getFileUrl: Already a full URL, returning as is:', relativePath);
    return relativePath;
  }

  const serverUrl = getServerBaseUrl();
  console.log('getFileUrl Debug:', {
    inputPath: relativePath,
    serverUrl: serverUrl,
    pathStartsWithStorage: relativePath.startsWith('/storage/'),
    pathStartsWithSlash: relativePath.startsWith('/')
  });

  // If the path already starts with /storage/, use it as is
  if (relativePath.startsWith('/storage/')) {
    const result = `${serverUrl}${relativePath}`;
    console.log('getFileUrl: Using storage path directly:', result);
    return result;
  }

  // If the path starts with /, use it as is
  if (relativePath.startsWith('/')) {
    const result = `${serverUrl}${relativePath}`;
    console.log('getFileUrl: Using slash path directly:', result);
    return result;
  }

  // For relative paths (like artworks/1/image.png), add /storage/ prefix
  const result = `${serverUrl}/storage/${relativePath}`;
  console.log('getFileUrl: Adding /storage/ prefix:', result);
  return result;
};

// Helper function for auth URLs
export const getAuthUrl = (provider) => {
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}auth/${provider}`;
};

// Export the URLs for backward compatibility
export const API_BASE_URL = getApiBaseUrl();
export const SERVER_BASE_URL = getServerBaseUrl();
