import axios from 'axios';
import { BASE_URL } from '../constants/ApiEndpoints';

const UserService = {
  // Get all users with pagination and filters
  getUsers: async (params = {}) => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      // Add pagination
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      
      // Add search
      if (params.search) queryParams.append('search', params.search);
      
      // Add filters
      if (params.role) queryParams.append('role', params.role);
      if (params.status) queryParams.append('status', params.status);
      
      // Add sorting
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_order) queryParams.append('sort_order', params.sort_order);
      
      const response = await axios.get(
        `${BASE_URL}admin/users?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  // Get single user by ID
  getUserById: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}admin/users`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}admin/users/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${BASE_URL}admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  },

  // Ban/Unban user
  toggleUserStatus: async (userId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}admin/users/${userId}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      throw new Error(`Failed to ${action} user`);
    }
  },

  // Get user statistics
  getUserStatistics: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}admin/users/statistics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw new Error('Failed to fetch user statistics');
    }
  },

  // Verify user email
  verifyUserEmail: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}admin/users/${userId}/verify-email`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error verifying user email:', error);
      throw new Error('Failed to verify user email');
    }
  },

  // Reset user password
  resetUserPassword: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}admin/users/${userId}/reset-password`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error resetting user password:', error);
      throw new Error('Failed to reset user password');
    }
  },

  // Get user activity logs
  getUserActivity: async (userId, params = {}) => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.per_page) queryParams.append('per_page', params.per_page);
      
      const response = await axios.get(
        `${BASE_URL}admin/users/${userId}/activity?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw new Error('Failed to fetch user activity');
    }
  },

  // Bulk actions
  bulkAction: async (action, userIds) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}admin/users/bulk-action`,
        {
          action,
          user_ids: userIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error performing bulk action:', error);
      throw new Error('Failed to perform bulk action');
    }
  },

  // Export users
  exportUsers: async (format = 'csv', filters = {}) => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      queryParams.append('format', format);
      Object.keys(filters).forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });
      
      const response = await axios.get(
        `${BASE_URL}admin/users/export?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error exporting users:', error);
      throw new Error('Failed to export users');
    }
  },
};

export default UserService;
