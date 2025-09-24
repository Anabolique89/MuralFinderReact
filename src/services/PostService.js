import axios from 'axios';
import { BASE_URL } from '../constants/ApiEndpoints';

const PostService = {
  createPost: async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        console.log("Post created successfully");
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  updatePost: async (id, formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}posts/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        console.log("Post updated successfully");
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${BASE_URL}posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        console.log("Post deleted successfully");
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  getPosts: async (params = {}) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}v1/posts`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  },

  getPost: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}v1/posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error("Error fetching post:", error);
      if (error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  }
};

export default PostService;
