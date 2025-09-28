import axios from 'axios';
import { BASE_URL, dashboardEndpoints } from '../constants/ApiEndpoints';


const DashboardService = {

    getDashboardData: async () => {
        try {
            const response = await axios.get(`${BASE_URL}${dashboardEndpoints.getDashboardData}`);

            console.log(response.data.data)
            return response.data.data;
        
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw new Error('Failed to fetch dashboard data');
        }
    },

    getArtworksStatistics: async () => {
        try {
            const response = await axios.get(`${BASE_URL}${dashboardEndpoints.getArtworksStatistics}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw new Error('Failed to fetch dashboard data');
        }
    },

    getWallsStatisticsData: async () => {
        try {
            const response = await axios.get(`${BASE_URL}${dashboardEndpoints.getWallsStatisticsData}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw new Error('Failed to fetch dashboard data');
        }
    },

    getPostsStatisticsData: async () => {
        try {
            const response = await axios.get(`${BASE_URL}${dashboardEndpoints.getPostsStatisticsData}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw new Error('Failed to fetch dashboard data');
        }
    },

    getUsersStatisticsData: async (page) => {
        try {
            const response = await axios.get(`${BASE_URL}${dashboardEndpoints.getUsersStatisticsData(page)}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw new Error('Failed to fetch dashboard data');
        }
    },

    // Get all statistics for admin dashboard
    getStatistics: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}admin/statistics`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching admin statistics:', error);
            // Return mock data if API fails
            return {
                data: {
                    userCount: 0,
                    artworkCount: 0,
                    wallsCount: 0,
                    postCount: 0,
                }
            };
        }
    },

}

export default DashboardService;