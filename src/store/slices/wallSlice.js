import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  walls: [],
  currentWall: null,
  nearbyWalls: [],
  userWalls: [],
  mapCenter: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  mapZoom: 10,
  selectedWallId: null,
  filters: {
    radius: 10,
    verified: null,
    hasArtwork: null,
  },
  isLoading: false,
  error: null,
};

const wallSlice = createSlice({
  name: 'walls',
  initialState,
  reducers: {
    setWalls: (state, action) => {
      state.walls = action.payload;
    },
    addWall: (state, action) => {
      state.walls.unshift(action.payload);
    },
    updateWall: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.walls.findIndex(wall => wall.id === id);
      if (index !== -1) {
        state.walls[index] = { ...state.walls[index], ...updates };
      }
    },
    removeWall: (state, action) => {
      state.walls = state.walls.filter(wall => wall.id !== action.payload);
    },
    setCurrentWall: (state, action) => {
      state.currentWall = action.payload;
    },
    setNearbyWalls: (state, action) => {
      state.nearbyWalls = action.payload;
    },
    setUserWalls: (state, action) => {
      state.userWalls = action.payload;
    },
    setMapCenter: (state, action) => {
      state.mapCenter = action.payload;
    },
    setMapZoom: (state, action) => {
      state.mapZoom = action.payload;
    },
    setSelectedWallId: (state, action) => {
      state.selectedWallId = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setWalls,
  addWall,
  updateWall,
  removeWall,
  setCurrentWall,
  setNearbyWalls,
  setUserWalls,
  setMapCenter,
  setMapZoom,
  setSelectedWallId,
  setFilters,
  setLoading,
  setError,
} = wallSlice.actions;

export default wallSlice.reducer;
