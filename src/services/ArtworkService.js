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
  }
};

export default ArtworkService;