import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';

// Typed hooks for Redux
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Auth hooks
export const useAuth = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  return useMemo(() => ({
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    registrationSuccess: auth.registrationSuccess,
  }), [auth]);
};

// UI hooks
export const useUI = () => {
  const ui = useAppSelector(state => state.ui);
  const dispatch = useAppDispatch();
  
  return useMemo(() => ({
    isGlobalLoading: ui.isGlobalLoading,
    loadingStates: ui.loadingStates,
    modals: ui.modals,
    notifications: ui.notifications,
    theme: ui.theme,
    sidebarOpen: ui.sidebarOpen,
    mobileMenuOpen: ui.mobileMenuOpen,
    searchOpen: ui.searchOpen,
    filtersOpen: ui.filtersOpen,
    mapView: ui.mapView,
    mapZoom: ui.mapZoom,
    mapCenter: ui.mapCenter,
    feedView: ui.feedView,
    feedFilter: ui.feedFilter,
    globalError: ui.globalError,
    isOnline: ui.isOnline,
  }), [ui]);
};

// Artwork hooks
export const useArtworks = () => {
  const artworks = useAppSelector(state => state.artworks);
  
  return useMemo(() => ({
    currentArtwork: artworks.currentArtwork,
    feedArtworks: artworks.feedArtworks,
    featuredArtworks: artworks.featuredArtworks,
    nearbyArtworks: artworks.nearbyArtworks,
    currentPage: artworks.currentPage,
    totalPages: artworks.totalPages,
    hasNextPage: artworks.hasNextPage,
    filters: artworks.filters,
    sortBy: artworks.sortBy,
    sortOrder: artworks.sortOrder,
    viewMode: artworks.viewMode,
    uploadProgress: artworks.uploadProgress,
    isUploading: artworks.isUploading,
    uploadError: artworks.uploadError,
    categories: artworks.categories,
    userArtworks: artworks.userArtworks,
    likedArtworks: artworks.likedArtworks,
    recentlyViewed: artworks.recentlyViewed,
  }), [artworks]);
};

// Wall hooks
export const useWalls = () => {
  const walls = useAppSelector(state => state.walls);
  
  return useMemo(() => ({
    walls: walls.walls,
    currentWall: walls.currentWall,
    nearbyWalls: walls.nearbyWalls,
    userWalls: walls.userWalls,
    mapCenter: walls.mapCenter,
    mapZoom: walls.mapZoom,
    selectedWallId: walls.selectedWallId,
    filters: walls.filters,
    isLoading: walls.isLoading,
    error: walls.error,
  }), [walls]);
};

// Search hooks
export const useSearch = () => {
  const search = useAppSelector(state => state.search);
  
  return useMemo(() => ({
    query: search.query,
    results: search.results,
    suggestions: search.suggestions,
    recentSearches: search.recentSearches,
    filters: search.filters,
    isSearching: search.isSearching,
    hasSearched: search.hasSearched,
    totalResults: search.totalResults,
    currentPage: search.currentPage,
  }), [search]);
};

// Notification hooks
export const useNotifications = () => {
  const notifications = useAppSelector(state => state.notifications);
  
  return useMemo(() => ({
    notifications: notifications.notifications,
    unreadCount: notifications.unreadCount,
    isLoading: notifications.isLoading,
    error: notifications.error,
    preferences: notifications.preferences,
    realTimeEnabled: notifications.realTimeEnabled,
  }), [notifications]);
};

// Loading state hook
export const useLoadingState = (key) => {
  const loadingStates = useAppSelector(state => state.ui.loadingStates);
  return loadingStates[key] || false;
};

// Modal hook
export const useModal = (modalName) => {
  const modals = useAppSelector(state => state.ui.modals);
  const dispatch = useAppDispatch();
  
  return useMemo(() => ({
    isOpen: modals[modalName] || false,
    open: () => dispatch({ type: 'ui/openModal', payload: modalName }),
    close: () => dispatch({ type: 'ui/closeModal', payload: modalName }),
  }), [modals, modalName, dispatch]);
};

// Theme hook
export const useTheme = () => {
  const theme = useAppSelector(state => state.ui.theme);
  const dispatch = useAppDispatch();
  
  return useMemo(() => ({
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggle: () => dispatch({ 
      type: 'ui/setTheme', 
      payload: theme === 'dark' ? 'light' : 'dark' 
    }),
    setTheme: (newTheme) => dispatch({ type: 'ui/setTheme', payload: newTheme }),
  }), [theme, dispatch]);
};

// Network status hook
export const useNetworkStatus = () => {
  const isOnline = useAppSelector(state => state.ui.isOnline);
  return isOnline;
};

// Pagination hook
export const usePagination = (slice) => {
  const state = useAppSelector(state => state[slice]);
  const dispatch = useAppDispatch();
  
  return useMemo(() => ({
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    hasNextPage: state.hasNextPage,
    goToPage: (page) => dispatch({ 
      type: `${slice}/setCurrentPage`, 
      payload: page 
    }),
    nextPage: () => {
      if (state.hasNextPage) {
        dispatch({ 
          type: `${slice}/setCurrentPage`, 
          payload: state.currentPage + 1 
        });
      }
    },
    prevPage: () => {
      if (state.currentPage > 1) {
        dispatch({ 
          type: `${slice}/setCurrentPage`, 
          payload: state.currentPage - 1 
        });
      }
    },
  }), [state, slice, dispatch]);
};
