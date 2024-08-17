import axios from 'axios';
import { BASE_URL, wallEndpoints } from '../constants/ApiEndpoints';

const WallService = {
  getAllWalls: async (page = 1, perPage = 10) => {
    try {
      const response = await axios.get(`${BASE_URL}${wallEndpoints.getAllWalls(page, perPage)}`);
      return response.data; // Return the entire response, which should include 'data'
    } catch (error) {
      console.error('Error fetching walls:', error);
      throw new Error('Failed to fetch walls');
    }  
},


  getWallById: async (wallId) => {
    try {
      const url = `${BASE_URL}${wallEndpoints.getWallById(wallId)}`;
      console.log(url)
      const response = await axios.get(`${BASE_URL}${wallEndpoints.getWallById(wallId)}`);
      console.log(response.data)
      return response.data;

    } catch (error) {
      console.error('Error fetching wall:', error);
      throw new Error('Failed to fetch wall');
    }
  },

  addWall: async (wallData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}${wallEndpoints.addWall}`,
        wallData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding wall:', error);
      throw new Error('Failed to add wall');
    }
  },

  updateWall: async (wallId, updatedData) => {
    try {
      const response = await axios.put(`${BASE_URL}${wallEndpoints.updateWall(wallId)}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error updating wall:', error);
      throw new Error('Failed to update wall');
    }
  },

  deleteWall: async (wallId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}${wallEndpoints.deleteWall(wallId)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting wall:', error);
      throw new Error('Failed to delete wall');
    }
  }
};

export default WallService;
