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
    headers.set('content-type', 'application/json');
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
      query: ({ page = 1, pageSize = 20, category, search, nearby } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });
        
        if (category) params.append('category', category);
        if (search) params.append('search', search);
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
      }),
      invalidatesTags: ['Wall'],
    }),
    
    updateWall: builder.mutation({
      query: ({ id, ...wallData }) => ({
        url: `walls/${id}`,
        method: 'PUT',
        body: wallData,
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
        if (query) params.append('q', query);
        if (type) params.append('type', type);
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            params.append(key, value);
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
  useGetWallsQuery,
  useGetWallByIdQuery,
  useCreateWallMutation,
  useUpdateWallMutation,
  useDeleteWallMutation,
  useLikeWallMutation,
  useGetPostsQuery,
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
} = muralFinderApi;
