import axios from "axios";
import { BASE_URL, artworkEndpoints } from "../constants/ApiEndpoints";

const ArtworkService = {
  loadArtworks: async () => {
    try {
      const response = await fetch(`${BASE_URL}${artworkEndpoints.getAllArtworks}`);
      const data = await response.json();
      if (data.success && data.data) {
        return data.data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  },

  searchArtworks: (artworks, searchText) => {
    return artworks.filter(artwork =>
      artwork.title.toLowerCase().includes(searchText.toLowerCase())
    );
  },

  searchArtworksOnBackend: async (searchText) => {
    try {
      const response = await fetch(`${BASE_URL}${artworkEndpoints.searchArtworks}?query=${searchText}`);
      const data = await response.json();
      if (data.success && data.data) {
        return data.data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  },

  uploadArtwork: async (formData) => {
    try {

      const token = sessionStorage.getItem('token')
      const response = await axios.post(`${BASE_URL}${artworkEndpoints.uploadArtwork}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.success) {
        console.log('Artwork uploaded successfully');
      } else {
        throw new Error(response.data.message || 'Failed to upload artwork');
      }
    } catch (error) {
      console.error('Error uploading artwork:', error);
      throw error;
    }
  }

};

export default ArtworkService;