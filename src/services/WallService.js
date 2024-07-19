import axios from 'axios';
import { BASE_URL, wallEndpoints } from '../constants/ApiEndpoints';

const WallService = {
  getAllWalls: async () => {
    try {
      const response = await axios.get(`${BASE_URL}${wallEndpoints.getAllWalls}`);
      return response.data.data.data
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
  }
};

export default WallService;
