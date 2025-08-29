import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  preferences: {
    email: {
      new_follower: true,
      artwork_liked: true,
      artwork_commented: true,
      post_liked: true,
      post_commented: true,
      wall_added_nearby: true,
      mentioned: true,
    },
    push: {
      new_follower: true,
      artwork_liked: true,
      artwork_commented: true,
      post_liked: true,
      post_commented: true,
      wall_added_nearby: true,
      mentioned: true,
    },
    app: {
      new_follower: true,
      artwork_liked: true,
      artwork_commented: true,
      post_liked: true,
      post_commented: true,
      wall_added_nearby: true,
      mentioned: true,
    },
  },
  realTimeEnabled: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.is_read) {
        state.unreadCount += 1;
      }
    },
    updateNotification: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.notifications.findIndex(n => n.id === id);
      if (index !== -1) {
        const wasUnread = !state.notifications[index].is_read;
        state.notifications[index] = { ...state.notifications[index], ...updates };
        
        // Update unread count
        if (wasUnread && updates.is_read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        } else if (!wasUnread && updates.is_read === false) {
          state.unreadCount += 1;
        }
      }
    },
    markAsRead: (state, action) => {
      const id = action.payload;
      const notification = state.notifications.find(n => n.id === id);
      if (notification && !notification.is_read) {
        notification.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.is_read = true;
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      const id = action.payload;
      const notification = state.notifications.find(n => n.id === id);
      if (notification && !notification.is_read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter(n => n.id !== id);
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    updatePreference: (state, action) => {
      const { category, type, value } = action.payload;
      if (state.preferences[category]) {
        state.preferences[category][type] = value;
      }
    },
    setRealTimeEnabled: (state, action) => {
      state.realTimeEnabled = action.payload;
    },
    // Real-time notification handling
    handleRealTimeNotification: (state, action) => {
      const notification = action.payload;
      
      // Add to notifications list
      state.notifications.unshift(notification);
      
      // Update unread count
      if (!notification.is_read) {
        state.unreadCount += 1;
      }
      
      // Keep only last 100 notifications
      if (state.notifications.length > 100) {
        state.notifications = state.notifications.slice(0, 100);
      }
    },
  },
});

export const {
  setNotifications,
  addNotification,
  updateNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  setUnreadCount,
  setLoading,
  setError,
  setPreferences,
  updatePreference,
  setRealTimeEnabled,
  handleRealTimeNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
