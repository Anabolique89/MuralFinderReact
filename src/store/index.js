import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices
import authSlice from './slices/authSlice';
import artworkSlice from './slices/artworkSlice';
import wallSlice from './slices/wallSlice';
import uiSlice from './slices/uiSlice';
import searchSlice from './slices/searchSlice';
import notificationSlice from './slices/notificationSlice';

// Import API
import { muralFinderApi } from './api/muralFinderApi';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui'], // Only persist auth and UI preferences
};

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  artworks: artworkSlice,
  walls: wallSlice,
  ui: uiSlice,
  search: searchSlice,
  notifications: notificationSlice,
  [muralFinderApi.reducerPath]: muralFinderApi.reducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(muralFinderApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// Export types for hooks
export const selectAuth = (state) => state.auth;
export const selectArtworks = (state) => state.artworks;
export const selectWalls = (state) => state.walls;
export const selectUI = (state) => state.ui;
export const selectSearch = (state) => state.search;
export const selectNotifications = (state) => state.notifications;
