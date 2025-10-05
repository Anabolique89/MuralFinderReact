import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Loading states
  isGlobalLoading: false,
  loadingStates: {},

  // Modal states
  modals: {
    loginModal: false,
    signupModal: false,
    addArtworkModal: false,
    addWallModal: false,
    addPostModal: false,
    profileModal: false,
    settingsModal: false,
  },

  // Notification states
  notifications: [],

  // Theme and preferences
  theme: "light",
  sidebarOpen: false,
  mobileMenuOpen: false,

  // Search and filters
  searchOpen: false,
  filtersOpen: false,

  // Map states
  mapView: "normal", // 'normal', 'satellite', 'terrain'
  mapZoom: 10,
  mapCenter: null,

  // Feed preferences
  feedView: "grid", // 'grid', 'list', 'masonry'
  feedFilter: "all", // 'all', 'following', 'nearby'

  // Error states
  globalError: null,

  // Network status
  isOnline: navigator.onLine,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Loading states
    setGlobalLoading: (state, action) => {
      state.isGlobalLoading = action.payload;
    },
    setLoadingState: (state, action) => {
      const { key, loading } = action.payload;
      state.loadingStates[key] = loading;
    },
    clearLoadingState: (state, action) => {
      delete state.loadingStates[action.payload];
    },

    // Modal management
    openModal: (state, action) => {
      const modalName = action.payload;
      state.modals[modalName] = true;
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      state.modals[modalName] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((modal) => {
        state.modals[modal] = false;
      });
    },

    // Notification management
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        timestamp: Date.now(),
        ...action.payload,
      };
      state.notifications.unshift(notification);

      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
    },

    // Theme and layout
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },

    // Search and filters
    setSearchOpen: (state, action) => {
      state.searchOpen = action.payload;
    },
    setFiltersOpen: (state, action) => {
      state.filtersOpen = action.payload;
    },

    // Map controls
    setMapView: (state, action) => {
      state.mapView = action.payload;
    },
    setMapZoom: (state, action) => {
      state.mapZoom = action.payload;
    },
    setMapCenter: (state, action) => {
      state.mapCenter = action.payload;
    },

    // Feed preferences
    setFeedView: (state, action) => {
      state.feedView = action.payload;
    },
    setFeedFilter: (state, action) => {
      state.feedFilter = action.payload;
    },

    // Error handling
    setGlobalError: (state, action) => {
      state.globalError = action.payload;
    },
    clearGlobalError: (state) => {
      state.globalError = null;
    },

    // Network status
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
  },
});

export const {
  setGlobalLoading,
  setLoadingState,
  clearLoadingState,
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearNotifications,
  markNotificationAsRead,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  setSearchOpen,
  setFiltersOpen,
  setMapView,
  setMapZoom,
  setMapCenter,
  setFeedView,
  setFeedFilter,
  setGlobalError,
  clearGlobalError,
  setOnlineStatus,
} = uiSlice.actions;

export default uiSlice.reducer;
