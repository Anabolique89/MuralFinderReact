import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import { muralFinderApi } from './api/muralFinderApi';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import searchReducer from './slices/searchSlice';

// Simple reducers for missing slices
const themeReducer = (state = { mode: 'light' }, action) => {
  switch (action.type) {
    case 'theme/toggle':
      return { mode: state.mode === 'light' ? 'dark' : 'light' };
    case 'theme/set':
      return { mode: action.payload };
    default:
      return state;
  }
};

const notificationsReducer = (state = { items: [], unreadCount: 0 }, action) => {
  switch (action.type) {
    case 'notifications/add':
      return {
        ...state,
        items: [...state.items, action.payload],
        unreadCount: state.unreadCount + 1
      };
    case 'notifications/markAsRead':
      return {
        ...state,
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    default:
      return state;
  }
};

const artworksReducer = (state = { items: [], loading: false }, action) => {
  switch (action.type) {
    case 'artworks/setLoading':
      return { ...state, loading: action.payload };
    case 'artworks/setItems':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};


// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui', 'theme'], // Only persist these reducers
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  search: searchReducer,
  theme: themeReducer,
  notifications: notificationsReducer,
  artworks: artworksReducer,
  [muralFinderApi.reducerPath]: muralFinderApi.reducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          muralFinderApi.util.resetApiState.type,
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
    }).concat(muralFinderApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);