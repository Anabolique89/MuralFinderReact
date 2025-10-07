import { useSelector, useDispatch } from 'react-redux';

// Auth hook
export const useAuth = () => {
  const user = useSelector(state => state.auth?.user);
  const token = useSelector(state => state.auth?.token);
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);
  
  return {
    user,
    token,
    isAuthenticated,
  };
};

// Theme hook
export const useTheme = () => {
  const theme = useSelector(state => state.theme?.mode || 'light');
  
  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
};

// Notifications hook
export const useNotifications = () => {
  const notifications = useSelector(state => state.notifications?.items || []);
  const unreadCount = useSelector(state => state.notifications?.unreadCount || 0);
  
  return {
    notifications,
    unreadCount,
  };
};

// Artworks hook
export const useArtworks = () => {
  const artworks = useSelector(state => state.artworks?.items || []);
  const loading = useSelector(state => state.artworks?.loading || false);
  const feedArtworks = useSelector(state => state.artworks?.feedArtworks || []);
  const viewMode = useSelector(state => state.artworks?.viewMode || 'grid');
  const filters = useSelector(state => state.artworks?.filters || {});
  
  return {
    artworks,
    feedArtworks,
    loading,
    viewMode,
    filters,
  };
};

// Search hook
export const useSearch = () => {
  const query = useSelector(state => state.search?.query || '');
  const results = useSelector(state => state.search?.results || []);
  const suggestions = useSelector(state => state.search?.suggestions || []);
  const recentSearches = useSelector(state => state.search?.recentSearches || []);
  const filters = useSelector(state => state.search?.filters || { type: 'all' });
  const isSearching = useSelector(state => state.search?.isSearching || false);
  const hasSearched = useSelector(state => state.search?.hasSearched || false);
  const totalResults = useSelector(state => state.search?.totalResults || 0);
  const currentPage = useSelector(state => state.search?.currentPage || 1);
  
  return {
    query,
    results,
    suggestions,
    recentSearches,
    filters,
    isSearching,
    hasSearched,
    totalResults,
    currentPage,
  };
};

// UI hook - combines theme and notifications
export const useUI = () => {
  const theme = useSelector(state => state.theme?.mode || 'light');
  const notifications = useSelector(state => state.ui?.notifications || []);
  
  return {
    theme,
    notifications,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
};

// Generic hook for accessing any part of the Redux state
export const useAppSelector = useSelector;

// Generic hook for dispatching actions
export const useAppDispatch = useDispatch;