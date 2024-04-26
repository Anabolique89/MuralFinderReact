export const BASE_URL = 'https://api.muralfinder.net/api/';

export const authEndpoints = {
  login: 'login',
  register: 'register',
  logout: 'logout',
  profile: (userId) => `profiles/${userId}`
};


export const artworkEndpoints = {
  getAllArtworks: 'artworks',
  uploadArtwork: 'artworks',
  searchArtworks: 'artworks/artwork/search'
};

export const blogEndpoints = {
  getAllBlogPosts: 'posts',
  getBlogPostById: (postId) => `posts/${postId}`,
  getBlogPostByUserId: (userId) => `posts/post/${userId}/get`,
  createBlogPost: 'posts',
  updateBlogPost: (postId) => `posts/${postId}`,
  deleteBlogPost: (postId) => `posts/${postId}`,
  getCommentsForBlogPost: (postId) => `posts/${postId}/comments`,
  commentOnBlogPost: (postId) => `posts/${postId}/comment`,
  likeBlogPost: (postId) => `posts/${postId}/like`,
};


export const wallEndpoints = {
  getAllWalls: 'walls',
  getWallById: (wallId) => `walls/${wallId}`,
  addWall: 'walls',
  updateWall: (wallId) => `walls/${wallId}`
};


export const contactEndpoint = "/contact";
