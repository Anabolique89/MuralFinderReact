import axios from "axios";
import { BASE_URL, fellowshipEndpoints } from "../constants/ApiEndpoints";

const FellowshipService = {
    follow: async (userId) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(
                `${BASE_URL}${fellowshipEndpoints.follow}`,
                { "user_id": userId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' // Add content type header
                    }
                }
            );
            if (response.data.success) {
                return 'User followed successfully';
            } else {
                throw new Error(response.data.message || 'Failed to follow user');
            }
        } catch (error) {
            console.error('Error following user:', error.response.data);
            return error.response.data.message
        }
    },

    unfollow: async (userId) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(
                `${BASE_URL}${fellowshipEndpoints.unfollow}`,
                { "user_id": userId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.data.success) {
                return 'User unfollowed successfully';
            } else {
               return response.data.message || 'Failed to follow user';
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
            return error.response.data.message
        }
    },
    isFollowing: async (userId) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(
                `${BASE_URL}${fellowshipEndpoints.isFollowing(userId)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response.data.data;
        } catch (error) {
            console.error('Error checking if user is following:', error);
            throw error;
        }
    }
};

export default FellowshipService;
