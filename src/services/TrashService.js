import axios from "axios";
import { BASE_URL } from "../constants/ApiEndpoints";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

const getModelName = (type) => {
  // Convert plural frontend types to singular backend model names
  const modelMap = {
    'artworks': 'artwork',
    'walls': 'wall',
    'users': 'user',
    'posts': 'post'
  };
  return modelMap[type] || type;
};

const TrashService = {
  // Fetch all trashed items across different models
  getAll: async () => {
    try {
      const response = await axios.get(`${BASE_URL}admin/trash`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching trashed items:", error);
      throw error;
    }
  },

  // Restore a soft-deleted item
  restore: async (type, id) => {
    try {
      const model = getModelName(type);
      const response = await axios.post(
        `${BASE_URL}admin/trash/${model}/${id}/restore`,
        null,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error restoring item:", error);
      throw error;
    }
  },

  // Permanently delete a soft-deleted item
  delete: async (type, id) => {
    try {
      const model = getModelName(type);
      const response = await axios.delete(
        `${BASE_URL}admin/trash/${model}/${id}`,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting item:", error);
      throw error;
    }
  },

  // Restore all trashed items (if you implement this functionality)
  restoreAll: async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}admin/trash/restoreAll`,
        null,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error restoring all items:", error);
      throw error;
    }
  },

  // Permanently delete all trashed items (if you implement this functionality)
  deleteAll: async () => {
    try {
      const response = await axios.delete(
        `${BASE_URL}admin/trash/deleteAll`,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting all items:", error);
      throw error;
    }
  },
};

export default TrashService;