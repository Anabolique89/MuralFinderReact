// Base URL for the API - from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Ensure BASE_URL ends with a slash for consistency
export const BASE_URL = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;

export const authEndpoints = {
  login: "login",
  register: "register",
  logout: "logout",
  profile: (userId) => `profiles/${userId}`,
  updateProfile: (userId) => `profiles/${userId}`,
  uploadProfileImage: (userId) => `profiles/${userId}/image`,
  deleteAccount: (userId) => `delete/user/${userId}`,
};

export const artworkEndpoints = {
  getAllArtworks: "v1/artworks",
  getUngroupedArtworks: (page, pageSize) => `v1/artworks?page=${page}&pageSize=${pageSize}`,
  uploadArtwork: "artworks",
  getCategoires: "legacy/categories",
  searchArtworks: "v1/artworks/search",
  artworkById: (artworkId) => `v1/artworks/${artworkId}`,
  getUserArtworks: (username) => `v1/users/${username}/artworks`,
  likeArtworks: (artworkId) => `artworks/${artworkId}/like`,
  unLikeArtworks: (artworkId) => `artworks/${artworkId}/unlike`,
};

export const blogEndpoints = {
  getAllBlogPosts: "v1/posts",
  getBlogPostById: (postId) => `v1/posts/${postId}`,
  getBlogPostByUserId: (username) => `v1/users/${username}/posts`, // Updated to use username
  createBlogPost: "posts",
  updateBlogPost: (postId) => `posts/${postId}`,
  deleteBlogPost: (postId) => `posts/${postId}`,
  getCommentsForBlogPost: (postId) => `posts/${postId}/comments`,
  commentOnBlogPost: (postId) => `posts/${postId}/comments`,
  likeBlogPost: (postId) => `posts/${postId}/like`,
};

export const wallEndpoints = {
  getAllWalls: (page = 1, perPage = 10) =>
    `api/walls?page=${page}&perPage=${perPage}`,
  getWallById: (wallId) => `api/walls/${wallId}`,
  addWall: "api/walls",
  updateWall: (wallId) => `api/walls/${wallId}`,

  updateComment: (wallId, commentId) => `api/walls/${wallId}/comments/${commentId}`,
  getCommentsForWall: (wallId) => `api/walls/${wallId}/comments`, // Add this
  commentOnWall: (wallId) => `api/walls/${wallId}/comments`, // Add this
  likeWall: (wallId) => `api/walls/${wallId}/like`, // Add this              // Add this

  deleteWall: (wallId) => `api/walls/${wallId}`,
};

export const fellowshipEndpoints = {
  follow: (username) => `users/${username}/follow`, // This stays in authenticated section
  unfollow: (username) => `users/${username}/follow`, // Same endpoint, different method
  isFollowing: (username) => `v1/users/${username}/following`, // Check if current user is following this user
  followers: (username) => `v1/users/${username}/followers`,
  following: (username) => `v1/users/${username}/following`,
};

export const dashboardEndpoints = {
  getDashboardData: "api/admin/statistics",
  getArtworksStatistics: "api/admin/statistics/artworks",
  getWallsStatisticsData: "api/admin/statistics/walls",
  getPostsStatisticsData: "api/admin/statistics/posts",
  getProductsStatisticsData: 'api/admin/statistics/products',
  getUsersStatisticsData: (page) => `api/admin/statistics/users?page=${page}`,
};

export const notificationEndpoints = {
  getNotifications: "notifications",
  markNotificationAsRead: (notificationId) => `notifications/${notificationId}/read`,
  markAllNotificationsAsRead: "notifications/read",
};


export const contactEndpoint = "/api/contact";
