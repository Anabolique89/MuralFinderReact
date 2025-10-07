import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base query with auth header
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?
    (import.meta.env.VITE_API_BASE_URL.endsWith('/') ? import.meta.env.VITE_API_BASE_URL : `${import.meta.env.VITE_API_BASE_URL}/`) :
    'http://localhost:8000/api/',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    // Don't set content-type here - let each request set its own
    // For FormData, the browser will set multipart/form-data with boundary
    // For JSON, we'll set application/json in individual queries
    return headers;
  },
});

// Base query with re-auth logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refreshResult = await baseQuery(
      { url: 'auth/refresh-token', method: 'POST' },
      api,
      extraOptions
    );
    
    if (refreshResult.data) {
      // Store new token
      api.dispatch({ type: 'auth/refreshToken/fulfilled', payload: refreshResult.data });
      // Retry original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, logout user
      api.dispatch({ type: 'auth/clearAuth' });
    }
  }
  
  return result;
};

export const muralFinderApi = createApi({
  reducerPath: 'muralFinderApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Artwork', 'Wall', 'Post', 'User', 'Comment', 'Notification'],
  endpoints: (builder) => ({
    // Artwork endpoints
    getArtworks: builder.query({
      query: ({ page = 1, pageSize = 20, category_id, search, nearby, sort_by } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: pageSize.toString(),
        });
        
        if (category_id) params.append('category_id', category_id);
        if (search) params.append('search', search);
        if (sort_by) params.append('sort_by', sort_by);
        if (nearby) {
          params.append('latitude', nearby.latitude);
          params.append('longitude', nearby.longitude);
          params.append('radius', nearby.radius || '10');
        }
        
        return `v1/artworks?${params}`;
      },
      providesTags: ['Artwork'],
    }),
    
    getArtworkById: builder.query({
      query: (id) => `v1/artworks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Artwork', id }],
    }),
    
    createArtwork: builder.mutation({
      query: (artworkData) => ({
        url: 'artworks',
        method: 'POST',
        body: artworkData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Artwork'],
    }),
    
    updateArtwork: builder.mutation({
      query: ({ id, ...artworkData }) => ({
        url: `artworks/${id}`,
        method: 'PUT',
        body: artworkData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Artwork', id }],
    }),
    
    deleteArtwork: builder.mutation({
      query: (id) => ({
        url: `artworks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Artwork'],
    }),
    
    likeArtwork: builder.mutation({
      query: (id) => ({
        url: `artworks/${id}/like`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Artwork', id }],
    }),

    // Categories endpoint
    getCategories: builder.query({
      query: () => 'legacy/categories',
      providesTags: ['Category'],
    }),
    
    // Wall endpoints
    getWalls: builder.query({
      query: ({ page = 1, pageSize = 20, nearby } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });
        
        if (nearby) {
          params.append('latitude', nearby.latitude);
          params.append('longitude', nearby.longitude);
          params.append('radius', nearby.radius || '10');
        }
        
        return `v1/walls?${params}`;
      },
      providesTags: ['Wall'],
    }),
    
    getWallById: builder.query({
      query: (id) => `v1/walls/${id}`,
      providesTags: (result, error, id) => [{ type: 'Wall', id }],
    }),
    
    createWall: builder.mutation({
      query: (wallData) => ({
        url: 'walls',
        method: 'POST',
        body: wallData,
        // Don't set Content-Type for FormData - let the browser set it with boundary
      }),
      invalidatesTags: ['Wall'],
    }),
    
    updateWall: builder.mutation({
      query: ({ id, ...wallData }) => ({
        url: `walls/${id}`,
        method: 'PUT',
        body: wallData,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Wall', id }],
    }),
    
    deleteWall: builder.mutation({
      query: (id) => ({
        url: `walls/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wall'],
    }),
    
    likeWall: builder.mutation({
      query: (id) => ({
        url: `walls/${id}/like`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Wall', id }],
    }),
    
    // Post endpoints
    getPosts: builder.query({
      query: ({ page = 1, pageSize = 20, featured, trending } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });
        
        let endpoint = 'v1/posts';
        if (featured) endpoint = 'v1/posts/featured';
        if (trending) endpoint = 'v1/posts/trending';
        
        return `${endpoint}?${params}`;
      },
      providesTags: ['Post'],
    }),
    
    // Admin posts endpoint (includes drafts)
    getAdminPosts: builder.query({
      query: ({ page = 1, pageSize = 20, status, category_id, type, user_id, featured } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: pageSize.toString(),
        });
        
        if (status) params.append('status', status);
        if (category_id) params.append('category_id', category_id);
        if (type) params.append('type', type);
        if (user_id) params.append('user_id', user_id);
        if (featured !== undefined) params.append('featured', featured);
        
        return `admin/posts?${params}`;
      },
      providesTags: ['Post'],
    }),
    
    getPostById: builder.query({
      query: (id) => `v1/posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    
    createPost: builder.mutation({
      query: (postData) => ({
        url: 'posts',
        method: 'POST',
        body: postData,
      }),
      invalidatesTags: ['Post'],
    }),
    
    updatePost: builder.mutation({
      query: ({ id, ...postData }) => ({
        url: `posts/${id}`,
        method: 'PUT',
        body: postData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
    }),
    
    deletePost: builder.mutation({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),
    
    likePost: builder.mutation({
      query: (id) => ({
        url: `posts/${id}/like`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    
    // User endpoints
    getUserProfile: builder.query({
      query: () => 'user/profile',
      providesTags: ['User'],
    }),
    
    updateUserProfile: builder.mutation({
      query: (profileData) => ({
        url: 'user/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),
    
    followUser: builder.mutation({
      query: (username) => ({
        url: `users/${username}/follow`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    
    // Search endpoints
    globalSearch: builder.query({
      query: ({ query, type, filters } = {}) => {
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (type) params.append('type', type);
        params.append('per_page', '20');
        
        // Add filters to params
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
              params.append(key, value);
            }
          });
        }
        
        return `v1/search/global?${params}`;
      },
    }),
    
    // Notification endpoints
    getNotifications: builder.query({
      query: ({ page = 1, pageSize = 20 } = {}) => 
        `notifications?page=${page}&pageSize=${pageSize}`,
      providesTags: ['Notification'],
    }),
    
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `notifications/${id}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),
    
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: 'notifications/mark-all-read',
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),

    // Admin endpoints - using existing backend endpoints
    getAdminStats: builder.query({
      query: () => 'admin/statistics',
      providesTags: ['Admin'],
    }),

    // Use admin user statistics endpoint for user management
    getAdminUsers: builder.query({
      query: ({ page = 1 } = {}) => {
        const params = new URLSearchParams();
        if (page > 1) params.append('page', page.toString());

        return `admin/statistics/users?${params}`;
      },
      providesTags: ['User'],
    }),

    // Admin CRUD operations
    createUser: builder.mutation({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `admin/users/${userId}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),

    banUser: builder.mutation({
      query: (userId) => ({
        url: `admin/users/${userId}/ban`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    unbanUser: builder.mutation({
      query: (userId) => ({
        url: `admin/users/${userId}/unban`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),


    // Settings
    getAdminSettings: builder.query({
      query: () => 'admin/settings',
      providesTags: ['Settings'],
    }),

    updateAdminSettings: builder.mutation({
      query: (settings) => ({
        url: 'admin/settings',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['Settings'],
    }),

    // Admin mutations (using v1 prefix)
    updateWallStatus: builder.mutation({
      query: ({ wallId, status, rejectionReason }) => ({
        url: `v1/admin/walls/${wallId}/status`,
        method: 'PUT',
        body: { status, rejection_reason: rejectionReason },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Wall'],
    }),

    deleteWallAdmin: builder.mutation({
      query: (wallId) => ({
        url: `v1/admin/walls/${wallId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wall'],
    }),

    updateArtworkStatus: builder.mutation({
      query: ({ artworkId, status, rejectionReason }) => ({
        url: `v1/admin/artworks/${artworkId}/status`,
        method: 'PUT',
        body: { status, rejection_reason: rejectionReason },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Artwork'],
    }),

    deleteArtworkAdmin: builder.mutation({
      query: (artworkId) => ({
        url: `v1/admin/artworks/${artworkId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Artwork'],
    }),

    updatePostStatus: builder.mutation({
      query: ({ postId, status }) => ({
        url: `v1/admin/posts/${postId}/status`,
        method: 'PUT',
        body: { status },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Post'],
    }),

    deletePostAdmin: builder.mutation({
      query: (postId) => ({
        url: `v1/admin/posts/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetArtworksQuery,
  useGetArtworkByIdQuery,
  useCreateArtworkMutation,
  useUpdateArtworkMutation,
  useDeleteArtworkMutation,
  useLikeArtworkMutation,
  useGetCategoriesQuery,
  useGetWallsQuery,
  useGetWallByIdQuery,
  useCreateWallMutation,
  useUpdateWallMutation,
  useDeleteWallMutation,
  useLikeWallMutation,
  useGetPostsQuery,
  useGetAdminPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useFollowUserMutation,
  useGlobalSearchQuery,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  // Admin hooks
  useGetAdminStatsQuery,
  useGetAdminUsersQuery,
  useCreateUserMutation,
  // Admin mutations
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useBanUserMutation,
  useUnbanUserMutation,
  useUpdateWallStatusMutation,
  useDeleteWallAdminMutation,
  useUpdateArtworkStatusMutation,
  useDeleteArtworkAdminMutation,
  useUpdatePostStatusMutation,
  useDeletePostAdminMutation,
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
} = muralFinderApi;
