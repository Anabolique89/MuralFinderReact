export const BASE_URL = 'https://api.muralfinder.net/api/';

export const authEndpoints = {
  login: 'login',
  register: 'register',
  logout: 'logout',
  profile: (userId) => `profiles/${userId}`,
  updateProfile: (userId) => `profiles/${userId}`,
  uploadProfileImage: (userId) => `profiles/${userId}/image`
};


export const artworkEndpoints = {
  getAllArtworks: 'artworks?pageSize=50',
  uploadArtwork: 'artworks',
  getCategoires: 'artworks/categories/fetch',
  searchArtworks: 'artworks/artwork/search',
  artworkById: (artworkId) => `artworks/${artworkId}`
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

export const fellowshipEndpoints = {
  follow: 'fellowships/follow',
  unfollow: 'fellowships/unfollow',
  isFollowing: (userId) => `fellowships/isFollowing/${userId}`,
}

export const contactEndpoint = "/contact";
