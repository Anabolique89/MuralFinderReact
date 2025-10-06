import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper,
  faSearch,
  faEye,
  faTrash,
  faSpinner,
  faPlus,
  faChevronLeft,
  faChevronRight,
  faHeart,
  faComment,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/layout/AdminLayout';
import {
  useGetAdminPostsQuery,
  useUpdatePostStatusMutation,
  useDeletePostAdminMutation
} from '../../store/api/muralFinderApi';
import { useToast } from '../../contexts/ToastContext';
import { getFileUrl } from '../../utils/apiConfig';

const ModernPosts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Use Redux Query for data fetching - using admin endpoint
  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError
  } = useGetAdminPostsQuery({
    page: currentPage,
    pageSize: 12,
    status: filterStatus !== 'all' ? filterStatus : undefined,
  });

  // Extract data with fallbacks
  const allPosts = postsData?.data?.data || [];
  const totalPages = postsData?.data?.last_page || 1;

  // Mutation hooks for CRUD operations
  const [updatePostStatus] = useUpdatePostStatusMutation();
  const [deletePost] = useDeletePostAdminMutation();

  // Toast notifications
  const toast = useToast();

  // Apply client-side filtering
  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = !searchTerm ||
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user?.username?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const posts = filteredPosts;


  // Action handlers
  const handleUpdateStatus = async (postId, newStatus, title) => {
    if (window.confirm(`Change status of post "${title}" to "${newStatus}"?`)) {
      try {
        await updatePostStatus({ postId, status: newStatus }).unwrap();
        toast.success(`Post "${title}" status changed to "${newStatus}"`, 'Status Updated');
      } catch (error) {
        toast.error(error.data?.message || error.message || 'Failed to update status', 'Update Failed');
      }
    }
  };

  const handleDeletePost = async (postId, title) => {
    if (window.confirm(`Are you sure you want to delete post "${title}"? This action cannot be undone.`)) {
      try {
        await deletePost(postId).unwrap();
        toast.success(`Post "${title}" deleted successfully`, 'Post Deleted');
      } catch (error) {
        toast.error(error.data?.message || error.message || 'Failed to delete post', 'Delete Failed');
      }
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (postsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-indigo-600 mb-4" />
            <p className="text-gray-600 font-raleway">Loading posts...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (postsError) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <p className="text-red-600 font-raleway">Error loading posts: {postsError.message}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-raleway">Posts Management</h1>
              <p className="text-gray-600 font-raleway mt-1">Manage and moderate blog posts</p>
            </div>
            <button
              onClick={() => navigate('/admin/posts/add')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-raleway font-semibold flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Post</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="likes_count-desc">Most Liked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                {post.featured_image ? (
                  <img
                    src={getFileUrl(post.featured_image)}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faNewspaper} className="text-4xl text-gray-400" />
                  </div>
                )}
                
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(post.status)}`}>
                    {post.status || 'draft'}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 font-raleway mb-1 truncate">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-600 font-raleway mb-2">
                  by {post.user?.username || 'Unknown Author'}
                </p>
                
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  {stripHtml(post.content).substring(0, 100)}...
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <FontAwesomeIcon icon={faHeart} />
                      <span>{post.likes_count || 0}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <FontAwesomeIcon icon={faComment} />
                      <span>{post.comments_count || 0}</span>
                    </span>
                  </div>
                  <span className="flex items-center space-x-1">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{formatDate(post.created_at)}</span>
                  </span>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <select
                    value={post.status || 'draft'}
                    onChange={(e) => handleUpdateStatus(post.id, e.target.value, post.title)}
                    className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="View Post"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id, post.title)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete Post"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 font-raleway">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </div>
        )}

        {posts.length === 0 && !postsLoading && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faNewspaper} className="text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 font-raleway mb-2">No posts found</h3>
            <p className="text-gray-500 font-raleway">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ModernPosts;