import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEye, faThumbsUp, faComment, faUser, faEdit, faTrash, faSearch, faFilter, faHeart, faShare, faPlus } from '@fortawesome/free-solid-svg-icons';
import BlogService from '@services/BlogService';
import { cleanHTML, trimContent } from '@utils/blogUtils';
import AuthService from '@services/AuthService';

const CommunityBlogSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  const currentUser = AuthService.getUser();

  useEffect(() => {
    const fetchBlogPosts = async (page = 1) => {
      try {
        setLoading(true);
        const response = await BlogService.getAllBlogPosts(page);

        // Use destructuring to extract the relevant data
        const { current_page, data, last_page, total } = response.data;

        // Sort the blog posts by 'created_at' or 'updated_at' in descending order
        const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setBlogPosts(sortedData);
        setCurrentPage(current_page);
        setTotalPages(last_page);
        setTotalItems(total);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    filterPosts();
  }, [blogPosts, searchTerm, selectedFilter]);

  const filterPosts = () => {
    let filtered = blogPosts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter (you can add more filters based on your blog structure)
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(post => post.category === selectedFilter);
    }

    setFilteredPosts(filtered);
  };
  

  const handleDelete = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await BlogService.deleteBlogPost(blogId);
        setBlogPosts(blogPosts.filter(blog => blog.id !== blogId));
        setAlertMessage('Blog post deleted successfully');
        setTimeout(() => {
          setAlertMessage('');
        }, 3000); // Remove the alert message after 3 seconds
      } catch (error) {
        console.error('Error deleting blog post:', error);
        setAlertMessage('Failed to delete blog post');
        setTimeout(() => {
          setAlertMessage('');
        }, 3000); // Remove the alert message after 3 seconds
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 w-full overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 bg-blue-300 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-300 rounded-full blur-xl animate-ping"></div>
      </div>

      <div className="relative z-10">
        {alertMessage && (
          <div className="max-w-6xl mx-auto px-4 pt-8">
            <div className="bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl relative mb-4 backdrop-blur-md" role="alert">
              <strong className="font-bold">Success:</strong>
              <span className="block sm:inline"> {alertMessage}</span>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="text-center py-12 px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white font-raleway mb-4 animate-slide-in-up">
            Community Stories
          </h2>
          <p className="text-xl text-white/80 font-raleway max-w-2xl mx-auto animate-slide-in-up" style={{animationDelay: '0.2s'}}>
            Discover inspiring stories, creative tips, and insights from our vibrant community of artists and art lovers
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-6xl mx-auto px-4 mb-8 animate-slide-in-up" style={{animationDelay: '0.4s'}}>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60"
                />
                <input
                  type="text"
                  placeholder="Search posts by title, content, author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <FontAwesomeIcon
                  icon={faFilter}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 z-10"
                />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="pl-12 pr-8 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-indigo-800">All Posts</option>
                  <option value="tutorial" className="bg-indigo-800">Tutorials</option>
                  <option value="showcase" className="bg-indigo-800">Showcase</option>
                  <option value="tips" className="bg-indigo-800">Tips</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-white/10 rounded-xl p-1 border border-white/20">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-white/20 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-white/20 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  List
                </button>
              </div>

              {/* Add Post Button */}
              <Link
                to="/blog/create"
                className="inline-flex items-center px-4 py-3 bg-blue-gradient text-primary font-raleway font-bold rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                New Post
              </Link>
            </div>
          </div>
        </div>
        {/* Loading State */}
        {loading && !blogPosts.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <FontAwesomeIcon icon={faSpinner} spin className="text-6xl text-white mb-4" />
              <p className="text-white text-xl font-raleway">Loading amazing stories...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="max-w-6xl mx-auto px-4 mb-6">
              <p className="text-white/80 font-raleway">
                Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>

            {/* Blog Posts Grid/List */}
            <div className="max-w-6xl mx-auto px-4 pb-12">
              {filteredPosts.length > 0 ? (
                <div className={`${
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-6'
                }`}>
                  {filteredPosts.map((blogPost, index) => (
                    <article
                      key={blogPost.id}
                      className="group bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-slide-in-up"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      {/* Featured Image */}
                      <div className="relative h-48 overflow-hidden">
                        {blogPost.feature_image ? (
                          <img
                            src={`https://api.muralfinder.net/${blogPost.feature_image}`}
                            alt={blogPost.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <FontAwesomeIcon icon={faUser} className="text-4xl text-white/50" />
                          </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center justify-between text-white">
                              <div className="flex items-center space-x-3">
                                <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                                  <FontAwesomeIcon icon={faEye} />
                                </button>
                                <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                                  <FontAwesomeIcon icon={faHeart} />
                                </button>
                                <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                                  <FontAwesomeIcon icon={faShare} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white font-raleway mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
                          <Link to={`/blog/${blogPost.id}`} className="hover:text-blue-400">
                            {blogPost.title}
                          </Link>
                        </h3>

                        <div className="text-white/70 font-raleway text-sm mb-4 line-clamp-3">
                          <div dangerouslySetInnerHTML={{ __html: cleanHTML(trimContent(blogPost.content, 150)) }} />
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 text-white/60 text-sm">
                            <div className="flex items-center space-x-1">
                              <FontAwesomeIcon icon={faEye} />
                              <span>{blogPost.views || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FontAwesomeIcon icon={faThumbsUp} />
                              <span>{blogPost.likes_count || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FontAwesomeIcon icon={faComment} />
                              <span>{blogPost.comments_count || 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* Author */}
                        <div className="flex items-center justify-between">
                          <Link to={`/profile/${blogPost.user.id}`} className="flex items-center space-x-3 group/author">
                            <img
                              src={`https://api.muralfinder.net${blogPost.user.profile?.profile_image_url}`}
                              alt={blogPost.user?.username}
                              className="w-10 h-10 rounded-full border-2 border-white/20 group-hover/author:border-white/40 transition-colors object-cover"
                            />
                            <div>
                              <p className="font-semibold font-raleway text-white text-sm group-hover/author:text-blue-300 transition-colors">
                                {blogPost.user.username.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </p>
                              <p className="text-white/60 font-raleway text-xs">
                                {blogPost.user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </p>
                            </div>
                          </Link>

                          {/* Action Buttons */}
                          {currentUser && currentUser.id === blogPost.user.id && (
                            <div className="flex items-center space-x-2">
                              <Link
                                to={`/blog/edit/${blogPost.id}`}
                                className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                              >
                                <FontAwesomeIcon icon={faEdit} className="text-sm" />
                              </Link>
                              <button
                                onClick={() => handleDelete(blogPost.id)}
                                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                              >
                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-6">📝</div>
                  <h3 className="text-2xl font-bold text-white font-raleway mb-4">
                    No posts found
                  </h3>
                  <p className="text-white/70 font-raleway mb-8 max-w-md mx-auto">
                    {searchTerm || selectedFilter !== 'all'
                      ? 'Try adjusting your search or filters to find more posts.'
                      : 'Be the first to share your story with our community!'}
                  </p>
                  <Link
                    to="/blog/create"
                    className="inline-flex items-center px-6 py-3 bg-blue-gradient text-primary font-raleway font-bold rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Create New Post
                  </Link>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="max-w-6xl mx-auto px-4 pb-12">
              <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-6 py-3 rounded-xl font-raleway font-medium transition-all duration-300 ${
                    currentPage === 1
                      ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
                  }`}
                >
                  Previous
                </button>

                <div className="text-center">
                  <span className="text-white font-raleway font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <p className="text-white/60 font-raleway text-sm mt-1">
                    {totalItems} total posts
                  </p>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-6 py-3 rounded-xl font-raleway font-medium transition-all duration-300 ${
                    currentPage === totalPages
                      ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                      : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CommunityBlogSection;
