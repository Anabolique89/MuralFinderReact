import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BlogService from '../../services/BlogService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEdit, faSpinner, faThumbsUp, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from '../../style';
import DOMPurify from 'dompurify';
import { BackToTopButton, Footer } from '../../components';

const SingleBlogPost = () => {
  const { postId } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [liking, setLiking] = useState(false);
  const [commenting, setCommenting] = useState(false);

  const sanitizedContent = blogPost && blogPost.content ? DOMPurify.sanitize(blogPost.content) : '';

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      console.log('Fetching comments for post:', postId);
      const response = await BlogService.getCommentsForBlogPost(postId);
      console.log('Comments response:', response);
      
      // Handle paginated response - extract the data array
      const commentsData = response.data || response;
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      // If it's a 401 error, just set empty comments (user not authenticated)
      if (error.response?.status === 401) {
        setComments([]);
      } else {
        setComments([]);
      }
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoadingPost(true);
        const response = await BlogService.getBlogPostById(postId);
        setBlogPost(response);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setBlogPost(null);
      } finally {
        setLoadingPost(false);
      }
    };

    fetchBlogPost();
    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async () => {
    try {
      setCommenting(true);
      console.log('Submitting comment:', { content: comment, post_id: postId });
      const result = await BlogService.commentOnBlogPost(postId, { content: comment, post_id: postId });
      console.log('Comment submission result:', result);
      setComment('');
      setShowCommentBox(false);
      
      // Refetch comments from server to get the actual comment with proper data
      console.log('Refetching comments after submission...');
      await fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setCommenting(false);
    }
  };

  const handleLike = async () => {
    try {
      setLiking(true);
      await BlogService.likeBlogPost(postId);
      const updatedBlogPost = await BlogService.getBlogPostById(postId);
      setBlogPost(updatedBlogPost);
    } catch (error) {
      console.error('Error liking blog post:', error);
    } finally {
      setLiking(false);
    }
  };

  if (loadingPost) {
    return (
      <div className="bg-indigo-600 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-6xl text-white mb-4" />
          <p className="text-white text-xl font-raleway">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="bg-indigo-600 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">📝</div>
          <h3 className="text-2xl font-bold text-white font-raleway mb-4">
            Blog Post Not Found
          </h3>
          <p className="text-white/70 font-raleway mb-8 max-w-md mx-auto">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/Community"
            className="inline-flex items-center px-6 py-3 bg-blue-gradient text-primary font-raleway font-bold rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Back to Community
          </Link>
        </div>
      </div>
    );
  }
  return (
    <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 min-h-screen pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 bg-blue-300 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-300 rounded-full blur-xl animate-ping"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12 animate-slide-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-raleway mb-4">
            {blogPost.title}
          </h1>
          <p className="text-xl text-white/80 font-raleway max-w-3xl mx-auto">
            Dive into this amazing story from our community
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Featured Image */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 animate-slide-in-left">
              {/* Featured Image */}
              <div className="relative h-96 overflow-hidden">
                {blogPost.feature_image ? (
                  <img
                    src={`https://api.muralfinder.net/${blogPost.feature_image}`}
                    alt={blogPost.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📝</div>
                      <p className="text-white text-xl font-raleway">Blog Post</p>
                    </div>
                  </div>
                )}

                {/* Edit Button Overlay */}
                <div className="absolute top-4 right-4">
                  <Link
                    to={`/blog/edit/${postId}`}
                    className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors border border-white/20"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Author Info */}
                {blogPost.user && (
                  <div className="flex items-center justify-between mb-6">
                    <Link to={`/profile/${blogPost.user.id}`} className="flex items-center space-x-4 group">
                      {blogPost.user.profile?.profile_image_url ? (
                        <img
                          src={`https://api.muralfinder.net${blogPost.user.profile.profile_image_url}`}
                          alt={blogPost.user?.username}
                          className='w-12 h-12 rounded-full object-cover border-2 border-white/20 group-hover:border-white/40 transition-colors'
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center border-2 border-white/20">
                          <FontAwesomeIcon icon={faUser} className="text-white" />
                        </div>
                      )}

                      <div>
                        <p className="font-semibold font-raleway text-white group-hover:text-blue-300 transition-colors">
                          {blogPost.user.username ?
                            blogPost.user.username.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                            : 'Unknown User'
                          }
                        </p>
                        <p className="text-white/60 font-raleway text-sm">
                          {blogPost.user.role ?
                            blogPost.user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                            : 'User'
                          }
                        </p>
                      </div>
                    </Link>

                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-white/60 text-sm">
                      <div className="flex items-center space-x-1">
                        <FontAwesomeIcon icon={faHeart} className="text-pink-400" />
                        <span>{blogPost.likes_count || 0}</span>
                      </div>
                      <span>{blogPost.date}</span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-invert max-w-none">
                  <div
                    className="text-white/90 font-raleway leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
                  <button
                    onClick={handleLike}
                    className="flex items-center space-x-2 px-6 py-3 bg-pink-500/20 text-pink-300 rounded-xl hover:bg-pink-500/30 transition-colors border border-pink-500/30"
                    disabled={liking}
                  >
                    {liking ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      <FontAwesomeIcon icon={faHeart} />
                    )}
                    <span>Like ({blogPost.likes_count || 0})</span>
                  </button>

                  <button
                    onClick={() => setShowCommentBox(!showCommentBox)}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors border border-blue-500/30"
                  >
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <span>Comment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column - Comments & Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 animate-slide-in-right">
              <h3 className="text-2xl font-bold text-white font-raleway mb-6 flex items-center">
                <FontAwesomeIcon icon={faThumbsUp} className="mr-3 text-blue-400" />
                Comments
              </h3>

              {/* Comment Form */}
              {showCommentBox && (
                <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    rows="4"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <button
                      onClick={() => setShowCommentBox(false)}
                      className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCommentSubmit}
                      className="px-6 py-2 bg-blue-gradient text-primary font-raleway font-bold rounded-xl hover:scale-105 transition-transform duration-300 disabled:opacity-50"
                      disabled={commenting || !comment.trim()}
                    >
                      {commenting ? (
                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                      ) : null}
                      {commenting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              )}

              {/* Add Comment Button */}
              {!showCommentBox && (
                <button
                  onClick={() => setShowCommentBox(true)}
                  className="w-full mb-6 p-4 bg-white/5 border border-white/20 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 text-left"
                >
                  💭 Add a comment...
                </button>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {loadingComments ? (
                  <div className="text-center py-8">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-white/60 mb-2" />
                    <p className="text-white/60 font-raleway">Loading comments...</p>
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div
                      key={comment.id}
                      className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors animate-slide-in-up"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="flex items-start space-x-3">
                        {comment.user?.profile?.profile_image_url ? (
                          <img
                            src={`https://api.muralfinder.net${comment.user.profile.profile_image_url}`}
                            alt={comment.user?.username}
                            className="w-8 h-8 rounded-full object-cover border border-white/20"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                            <FontAwesomeIcon icon={faUser} className="text-white text-xs" />
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-semibold text-white font-raleway text-sm">
                              {comment.user?.username || 'Anonymous'}
                            </p>
                            <span className="text-white/40 text-xs">•</span>
                            <span className="text-white/40 text-xs">
                              {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : 'Recently'}
                            </span>
                          </div>
                          <p className="text-white/80 font-raleway text-sm leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">💬</div>
                    <p className="text-white/60 font-raleway">No comments yet</p>
                    <p className="text-white/40 font-raleway text-sm mt-1">Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </div>
          </div>


        </div>

        {/* Back to Top Button */}
        <BackToTopButton />
      </div>

      {/* Footer */}
      <div className="bg-indigo-600 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Footer />
        </div>
      </div>
    </section>

  );
};

export default SingleBlogPost;
