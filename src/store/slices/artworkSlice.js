import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Current artwork data
  currentArtwork: null,
  
  // Feed data
  feedArtworks: [],
  featuredArtworks: [],
  nearbyArtworks: [],
  
  // Pagination
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,
  
  // Filters and sorting
  filters: {
    category: null,
    location: null,
    dateRange: null,
    artist: null,
  },
  sortBy: 'created_at',
  sortOrder: 'desc',
  
  // View preferences
  viewMode: 'grid', // 'grid', 'list', 'masonry'
  
  // Upload state
  uploadProgress: 0,
  isUploading: false,
  uploadError: null,
  
  // Categories
  categories: [],
  
  // User's artworks
  userArtworks: [],
  
  // Liked artworks
  likedArtworks: [],
  
  // Recently viewed
  recentlyViewed: [],
};

const artworkSlice = createSlice({
  name: 'artworks',
  initialState,
  reducers: {
    // Current artwork
    setCurrentArtwork: (state, action) => {
      state.currentArtwork = action.payload;
    },
    clearCurrentArtwork: (state) => {
      state.currentArtwork = null;
    },
    
    // Feed management
    setFeedArtworks: (state, action) => {
      state.feedArtworks = action.payload;
    },
    appendFeedArtworks: (state, action) => {
      state.feedArtworks = [...state.feedArtworks, ...action.payload];
    },
    prependFeedArtworks: (state, action) => {
      state.feedArtworks = [...action.payload, ...state.feedArtworks];
    },
    updateArtworkInFeed: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.feedArtworks.findIndex(artwork => artwork.id === id);
      if (index !== -1) {
        state.feedArtworks[index] = { ...state.feedArtworks[index], ...updates };
      }
    },
    removeArtworkFromFeed: (state, action) => {
      state.feedArtworks = state.feedArtworks.filter(
        artwork => artwork.id !== action.payload
      );
    },
    
    // Featured artworks
    setFeaturedArtworks: (state, action) => {
      state.featuredArtworks = action.payload;
    },
    
    // Nearby artworks
    setNearbyArtworks: (state, action) => {
      state.nearbyArtworks = action.payload;
    },
    
    // Pagination
    setPagination: (state, action) => {
      const { currentPage, totalPages, hasNextPage } = action.payload;
      state.currentPage = currentPage;
      state.totalPages = totalPages;
      state.hasNextPage = hasNextPage;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    
    // Filters and sorting
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: null,
        location: null,
        dateRange: null,
        artist: null,
      };
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    
    // View preferences
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    
    // Upload state
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    setIsUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    setUploadError: (state, action) => {
      state.uploadError = action.payload;
    },
    clearUploadState: (state) => {
      state.uploadProgress = 0;
      state.isUploading = false;
      state.uploadError = null;
    },
    
    // Categories
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    
    // User's artworks
    setUserArtworks: (state, action) => {
      state.userArtworks = action.payload;
    },
    addUserArtwork: (state, action) => {
      state.userArtworks.unshift(action.payload);
    },
    updateUserArtwork: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.userArtworks.findIndex(artwork => artwork.id === id);
      if (index !== -1) {
        state.userArtworks[index] = { ...state.userArtworks[index], ...updates };
      }
    },
    removeUserArtwork: (state, action) => {
      state.userArtworks = state.userArtworks.filter(
        artwork => artwork.id !== action.payload
      );
    },
    
    // Liked artworks
    setLikedArtworks: (state, action) => {
      state.likedArtworks = action.payload;
    },
    addLikedArtwork: (state, action) => {
      if (!state.likedArtworks.find(artwork => artwork.id === action.payload.id)) {
        state.likedArtworks.unshift(action.payload);
      }
    },
    removeLikedArtwork: (state, action) => {
      state.likedArtworks = state.likedArtworks.filter(
        artwork => artwork.id !== action.payload
      );
    },
    
    // Recently viewed
    addToRecentlyViewed: (state, action) => {
      const artwork = action.payload;
      // Remove if already exists
      state.recentlyViewed = state.recentlyViewed.filter(
        item => item.id !== artwork.id
      );
      // Add to beginning
      state.recentlyViewed.unshift(artwork);
      // Keep only last 20
      if (state.recentlyViewed.length > 20) {
        state.recentlyViewed = state.recentlyViewed.slice(0, 20);
      }
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
    },
    
    // Like/Unlike actions
    toggleArtworkLike: (state, action) => {
      const { artworkId, isLiked, likesCount } = action.payload;
      
      // Update in feed
      const feedIndex = state.feedArtworks.findIndex(artwork => artwork.id === artworkId);
      if (feedIndex !== -1) {
        state.feedArtworks[feedIndex].is_liked = isLiked;
        state.feedArtworks[feedIndex].likes_count = likesCount;
      }
      
      // Update current artwork
      if (state.currentArtwork && state.currentArtwork.id === artworkId) {
        state.currentArtwork.is_liked = isLiked;
        state.currentArtwork.likes_count = likesCount;
      }
      
      // Update in user artworks
      const userIndex = state.userArtworks.findIndex(artwork => artwork.id === artworkId);
      if (userIndex !== -1) {
        state.userArtworks[userIndex].is_liked = isLiked;
        state.userArtworks[userIndex].likes_count = likesCount;
      }
    },
  },
});

export const {
  setCurrentArtwork,
  clearCurrentArtwork,
  setFeedArtworks,
  appendFeedArtworks,
  prependFeedArtworks,
  updateArtworkInFeed,
  removeArtworkFromFeed,
  setFeaturedArtworks,
  setNearbyArtworks,
  setPagination,
  setCurrentPage,
  setFilters,
  clearFilters,
  setSortBy,
  setSortOrder,
  setViewMode,
  setUploadProgress,
  setIsUploading,
  setUploadError,
  clearUploadState,
  setCategories,
  setUserArtworks,
  addUserArtwork,
  updateUserArtwork,
  removeUserArtwork,
  setLikedArtworks,
  addLikedArtwork,
  removeLikedArtwork,
  addToRecentlyViewed,
  clearRecentlyViewed,
  toggleArtworkLike,
} = artworkSlice.actions;

export default artworkSlice.reducer;
