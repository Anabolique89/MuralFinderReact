import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faImage,
  faSearch,
  faFilter,
  faEye,
  faEdit,
  faTrash,
  faSpinner,
  faPlus,
  faSort,
  faChevronLeft,
  faChevronRight,
  faHeart,
  faComment,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/layout/AdminLayout';
import {
  useGetArtworksQuery,
  useUpdateArtworkStatusMutation,
  useDeleteArtworkAdminMutation
} from '../../store/api/muralFinderApi';
import { useToast } from '../../contexts/ToastContext';

const ModernArtworks = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Use Redux Query for data fetching - using existing artworks endpoint
  const {
    data: artworksData,
    isLoading: artworksLoading,
    error: artworksError
  } = useGetArtworksQuery({
    page: currentPage,
    pageSize: 12,
    search: searchTerm || undefined,
    // Note: status filtering not available in public endpoint
  });

  // Extract data with fallbacks - accessing nested data structure
  const allArtworks = artworksData?.data?.data || [];
  const totalPages = artworksData?.data?.last_page || 1;
  const currentPageFromAPI = artworksData?.data?.current_page || 1;

  // Mutation hooks for CRUD operations
  const [updateArtworkStatus] = useUpdateArtworkStatusMutation();
  const [deleteArtwork] = useDeleteArtworkAdminMutation();

  // Toast notifications
  const toast = useToast();

  // Apply client-side filtering
  const filteredArtworks = allArtworks.filter(artwork => {
    const matchesSearch = !searchTerm ||
      artwork.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.user?.username?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || artwork.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const artworks = filteredArtworks;

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Action handlers
  const handleUpdateStatus = async (artworkId, newStatus, title) => {
    let rejectionReason = null;
    if (newStatus === 'rejected') {
      rejectionReason = prompt('Please provide a reason for rejection:');
      if (!rejectionReason) return;
    }

    if (window.confirm(`Change status of "${title}" to "${newStatus}"?`)) {
      try {
        await updateArtworkStatus({ artworkId, status: newStatus, rejectionReason }).unwrap();
        toast.success(`Artwork "${title}" status changed to "${newStatus}"`, 'Status Updated');
      } catch (error) {
        toast.error(error.data?.message || error.message || 'Failed to update status', 'Update Failed');
      }
    }
  };

  const handleDeleteArtwork = async (artworkId, title) => {
    if (window.confirm(`Are you sure you want to delete artwork "${title}"? This action cannot be undone.`)) {
      try {
        await deleteArtwork(artworkId).unwrap();
        toast.success(`Artwork "${title}" deleted successfully`, 'Artwork Deleted');
      } catch (error) {
        toast.error(error.data?.message || error.message || 'Failed to delete artwork', 'Delete Failed');
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

  if (artworksLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-indigo-600 mb-4" />
            <p className="text-gray-600 font-raleway">Loading artworks...</p>
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
              <h1 className="text-2xl font-bold text-gray-900 font-raleway">Artworks Management</h1>
              <p className="text-gray-600 font-raleway mt-1">Manage and moderate artwork submissions</p>
            </div>
            <button
              onClick={() => navigate('/admin/artworks/add')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-raleway font-semibold flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Artwork</span>
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
                  placeholder="Search artworks..."
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

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          {artworks.map((artwork) => (
            <div key={artwork.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-200 relative">
                {artwork.image_url ? (
                  <img
                    src={`https://api.muralfinder.net/${artwork.image_url}`}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faImage} className="text-4xl text-gray-400" />
                  </div>
                )}
                
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(artwork.status)}`}>
                    {artwork.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 font-raleway mb-1 truncate">
                  {artwork.title}
                </h3>
                <p className="text-xs text-gray-600 font-raleway mb-2">
                  by {artwork.artist?.username || 'Unknown Artist'}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <FontAwesomeIcon icon={faHeart} />
                      <span>{artwork.likes_count || 0}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <FontAwesomeIcon icon={faComment} />
                      <span>{artwork.comments_count || 0}</span>
                    </span>
                  </div>
                  <span>{formatDate(artwork.created_at)}</span>
                </div>
                
                {artwork.location && (
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                    <span className="truncate">{artwork.location}</span>
                  </div>
                )}
                
                <div className="flex flex-col space-y-2">
                  <select
                    value={artwork.status}
                    onChange={(e) => handleUpdateStatus(artwork.id, e.target.value, artwork.title)}
                    className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => window.open(`/artwork/${artwork.id}`, '_blank')}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="View Artwork"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      onClick={() => handleDeleteArtwork(artwork.id, artwork.title)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete Artwork"
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

        {artworks.length === 0 && !artworksLoading && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faImage} className="text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 font-raleway mb-2">No artworks found</h3>
            <p className="text-gray-500 font-raleway">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ModernArtworks;
