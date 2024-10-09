export const BASE_URL = "https://api.muralfinder.net/api/";

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
  getAllArtworks: "artworks?pageSize=50",
  uploadArtwork: "artworks",
  getCategoires: "artworks/categories/fetch",
  searchArtworks: "artworks/artwork/search",
  artworkById: (artworkId) => `artworks/${artworkId}`,
  getUserArtworks: (userId) => `artworks/users/${userId}`,
  likeArtworks: (artworkId) => `artworks/${artworkId}/like`,
  unLikeArtworks: (artworkId) => `artworks/${artworkId}/unlike`,
};

export const blogEndpoints = {
  getAllBlogPosts: "posts",
  getBlogPostById: (postId) => `posts/${postId}`,
  getBlogPostByUserId: (userId) => `posts/post/${userId}/get`,
  createBlogPost: "posts",
  updateBlogPost: (postId) => `posts/${postId}`,
  deleteBlogPost: (postId) => `posts/${postId}`,
  getCommentsForBlogPost: (postId) => `posts/${postId}/comments`,
  commentOnBlogPost: (postId) => `posts/${postId}/comment`,
  likeBlogPost: (postId) => `posts/${postId}/like`,
};

export const wallEndpoints = {
  getAllWalls: (page = 1, perPage = 10) =>
    `walls?page=${page}&perPage=${perPage}`,
  getWallById: (wallId) => `walls/${wallId}`,
  addWall: "walls",
  updateWall: (wallId) => `walls/${wallId}`,
  getCommentsForWall: (wallId) => `walls/${wallId}/comments`, // Add this
  commentOnWall: (wallId) => `walls/${wallId}/comments`, // Add this
  likeWall: (wallId) => `walls/${wallId}/like`, // Add this
  deleteWall: (wallId) => `walls/${wallId}`,
};

export const fellowshipEndpoints = {
  follow: "fellowships/follow",
  unfollow: "fellowships/unfollow",
  isFollowing: (userId) => `fellowships/isFollowing/${userId}`,
};

export const dashboardEndpoints = {
  getDashboardData: "admin/statistics",
  getArtworksStatistics: "admin/statistics/artworks",
  getWallsStatisticsData: "admin/statistics/walls",
  getPostsStatisticsData: "admin/statistics/posts",
  getUsersStatisticsData: (page) => `admin/statistics/users?page=${page}`,
};

export const contactEndpoint = "/contact";
