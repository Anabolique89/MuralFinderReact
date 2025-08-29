import axios from "axios";
import { BASE_URL, fellowshipEndpoints } from "../constants/ApiEndpoints";

const FellowshipService = {
    follow: async (username) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${BASE_URL}${fellowshipEndpoints.follow(username)}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data.success) {
                return 'User followed successfully';
            } else {
                throw new Error(response.data.message || 'Failed to follow user');
            }
        } catch (error) {
            console.error('Error following user:', error.response?.data);
            return error.response?.data?.message || 'Failed to follow user';
        }
    },

    unfollow: async (username) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${BASE_URL}${fellowshipEndpoints.unfollow(username)}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data.success) {
                return 'User unfollowed successfully';
            } else {
               return response.data.message || 'Failed to unfollow user';
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
            return error.response?.data?.message || 'Failed to unfollow user';
        }
    },
    isFollowing: async (username) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${BASE_URL}${fellowshipEndpoints.following(username)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            // Check if current user is in the following list
            let followingList = response.data.data || [];

            // Handle paginated response structure
            if (followingList.data && Array.isArray(followingList.data)) {
                followingList = followingList.data;
            }

            // Ensure followingList is an array
            if (!Array.isArray(followingList)) {
                console.warn('Following list is not an array:', followingList);
                return false;
            }

            const currentUser = JSON.parse(localStorage.getItem('user'));
            return followingList.some(user => user.id === currentUser?.id);
        } catch (error) {
            console.error('Error checking if user is following:', error);
            return false; // Return false instead of throwing error
        }
    }
};

export default FellowshipService;
