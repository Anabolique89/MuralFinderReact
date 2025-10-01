import axios from "axios";
import { BASE_URL, notificationEndpoints } from "../constants/ApiEndpoints";

const NotificationService = {
    // Fetch notifications for the authenticated user, optionally paginated
    fetchNotifications: async (page = 1) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            
            const response = await axios.get(`${BASE_URL}${notificationEndpoints.getNotifications}`, {
                params: { page },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            
            // Handle different response structures
            if (response.data && response.data.data) {
                return response.data.data;
            } else if (response.data && response.data.notifications) {
                return response.data.notifications;
            } else if (Array.isArray(response.data)) {
                return response.data;
            } else {
                console.warn('Unexpected response structure:', response.data);
                return [];
            }
        } catch (error) {
            console.error('Error fetching notifications:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                throw new Error('Authentication required to fetch notifications');
            }
            throw new Error(error.response?.data?.message || error.message || 'Failed to fetch notifications');
        }
    },
    
    // Mark a specific notification as read
    markNotificationAsRead: async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BASE_URL}${notificationEndpoints.markNotificationAsRead(notificationId)}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token for authentication
                },
            });
            return 'Notification marked as read';
        } catch (error) {
            console.error('Error marking notification as read:', error.response.data);
            throw new Error(error.response.data.message || 'Failed to mark notification as read'); // Throw an error with a message
        }
    },

    // Mark all notifications as read
    markAllNotificationsAsRead: async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BASE_URL}${notificationEndpoints.markAllNotificationsAsRead}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token for authentication
                },
            });
            return 'All notifications marked as read'; // Return a success message
        } catch (error) {
            console.error('Error marking all notifications as read:', error.response.data);
            throw new Error(error.response.data.message || 'Failed to mark all notifications as read'); // Throw an error with a message
        }
    }
};

export default NotificationService;
