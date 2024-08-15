import axios from "axios";
import { BASE_URL, wallEndpoints } from "../constants/ApiEndpoints";

const WallService = {
  getAllWalls: async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}${wallEndpoints.getAllWalls}`
      );
      return response.data; // Return the entire response
    } catch (error) {
      console.error("Error fetching walls:", error);
      throw new Error("Failed to fetch walls");
    }
  },

  getWallById: async (wallId) => {
    try {
      const url = `${BASE_URL}${wallEndpoints.getWallById(wallId)}`;
      console.log(url);
      const response = await axios.get(
        `${BASE_URL}${wallEndpoints.getWallById(wallId)}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching wall:", error);
      throw new Error("Failed to fetch wall");
    }
  },

  addWall: async (wallData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}${wallEndpoints.addWall}`,
        wallData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding wall:", error);
      throw new Error("Failed to add wall");
    }
  },

  updateWall: async (wallId, updatedData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}${wallEndpoints.updateWall(wallId)}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating wall:", error);
      throw new Error("Failed to update wall");
    }
  },

  //fetching wall comments:
  getCommentsForWall: async (wallId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}${wallEndpoints.getCommentsForWall(wallId)}`
      );
      return response.data; // Assuming this returns the list of comments
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw new Error("Failed to fetch comments");
    }
  },

  commentOnWall: async (wallId, commentData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}${wallEndpoints.commentOnWall(wallId)}`,
        commentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error posting comment:", error);
      throw new Error("Failed to post comment");
    }
  },

  likeWall: async (wallId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}${wallEndpoints.likeWall(wallId)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error liking wall:", error);
      throw new Error("Failed to like wall");
    }
  },
};

export default WallService;
