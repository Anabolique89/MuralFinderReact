export const BASE_URL = 'https://api.muralfinder.net/api/';

export const authEndpoints = {
  login: 'login',
  register: 'register',
  logout: 'logout'
};

export const artworkEndpoints = {
  getAllArtworks: 'artworks',
  searchArtworks: 'artworks/artwork/search'
};

export const blogEndpoints = {
  getAllBlogPosts: 'posts',
  getBlogPostById: (postId) => `posts/${postId}`,
  createBlogPost: 'posts',
  updateBlogPost: (postId) => `posts/${postId}`,
  deleteBlogPost: (postId) => `posts/${postId}`,
  getCommentsForBlogPost: (postId) => `posts/${postId}/comments`,
  commentOnBlogPost: (postId) => `posts/${postId}/comment`,
  likeBlogPost: (postId) => `posts/${postId}/like`,
};


export const contactEndpoint = "/contact";
