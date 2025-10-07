import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faSearch,
  faEye,
  faTrash,
  faSpinner,
  faPlus,
  faChevronLeft,
  faChevronRight,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/layout/AdminLayout';
import {
  useGetWallsQuery,
  useUpdateWallStatusMutation,
  useDeleteWallAdminMutation
} from '../../store/api/muralFinderApi';
import { useToast } from '../../contexts/ToastContext';
import { getFileUrl } from '../../utils/apiConfig';

const ModernWalls = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Use Redux Query for data fetching
  const {
    data: wallsData,
    isLoading: wallsLoading,
    error: wallsError
  } = useGetWallsQuery({
    page: currentPage,
    pageSize: 12,
  });

  // Extract data with fallbacks
  const allWalls = wallsData?.data?.data || [];
  const totalPages = wallsData?.data?.last_page || 1;
  const currentPageFromAPI = wallsData?.data?.current_page || 1;

  // Mutation hooks for CRUD operations
  const [updateWallStatus] = useUpdateWallStatusMutation();
  const [deleteWall] = useDeleteWallAdminMutation();

  // Toast notifications
  const toast = useToast();

  // Apply client-side filtering
  const filteredWalls = allWalls.filter(wall => {
    const matchesSearch = !searchTerm ||
      wall.location_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wall.addedBy?.username?.toLowerCase().includes(searchTerm.toLowerCase());

    const isVerified = wall.status === 'verified';
    const matchesStatus = filterStatus === 'all' || isVerified === (filterStatus === 'verified');

    return matchesSearch && matchesStatus;
  });

  const walls = filteredWalls;

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Action handlers
  const handleUpdateStatus = async (wallId, newStatus, location) => {
    // Convert boolean to proper status string
    const statusString = newStatus ? 'verified' : 'pending';
    
    if (window.confirm(`Change verification status for wall at "${location}" to "${statusString}"?`)) {
      try {
        await updateWallStatus({ wallId, status: statusString }).unwrap();
        toast.success(`Wall at "${location}" status changed to "${statusString}"`, 'Status Updated');
      } catch (error) {
        toast.error(error.data?.message || error.message || 'Failed to update status', 'Update Failed');
      }
    }
  };

  const handleDeleteWall = async (wallId, location) => {
    if (window.confirm(`Are you sure you want to delete wall at "${location}"? This action cannot be undone.`)) {
      try {
        await deleteWall(wallId).unwrap();
        toast.success(`Wall at "${location}" deleted successfully`, 'Wall Deleted');
      } catch (error) {
        toast.error(error.data?.message || error.message || 'Failed to delete wall', 'Delete Failed');
      }
    }
  };

  const getStatusBadgeColor = (status) => {
    return status === 'verified'
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (wallsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-indigo-600 mb-4" />
            <p className="text-gray-600 font-raleway">Loading walls...</p>
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
              <h1 className="text-2xl font-bold text-gray-900 font-raleway">Walls Management</h1>
              <p className="text-gray-600 font-raleway mt-1">Manage and verify wall locations</p>
            </div>
            <button
              onClick={() => navigate('/admin/walls/add')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-raleway font-semibold flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Wall</span>
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
                  placeholder="Search walls..."
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
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
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
                <option value="location_text-asc">Location A-Z</option>
                <option value="location_text-desc">Location Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Walls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {walls.map((wall) => (
            <div key={wall.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                {wall.image_path ? (
                  <img
                    src={(() => {
                      const imageUrl = getFileUrl(wall.image_path);
                      console.log('ModernWalls - Image URL Debug:', {
                        wallId: wall.id,
                        imagePath: wall.image_path,
                        constructedUrl: imageUrl,
                        location: wall.location_text
                      });
                      return imageUrl;
                    })()}
                    alt={wall.location_text}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-4xl text-gray-400" />
                  </div>
                )}
                
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(wall.status)}`}>
                    {wall.status === 'verified' ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 font-raleway mb-1 truncate">
                  {wall.location_text || 'Unknown Location'}
                </h3>
                <p className="text-xs text-gray-600 font-raleway mb-2">
                  Added by {wall.addedBy?.username || 'Unknown User'}
                </p>
                
                <div className="text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-1 mb-1">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>
                      {wall.latitude ? Number(wall.latitude).toFixed(4) : 'N/A'}, 
                      {wall.longitude ? Number(wall.longitude).toFixed(4) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{formatDate(wall.created_at)}</span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleUpdateStatus(wall.id, wall.status !== 'verified', wall.location_text)}
                      className={`text-xs px-3 py-1 rounded ${
                        wall.status === 'verified'
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {wall.status === 'verified' ? 'Unverify' : 'Verify'}
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => window.open(`/wall/${wall.id}`, '_blank')}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="View Wall"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => handleDeleteWall(wall.id, wall.location_text)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Wall"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
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

        {walls.length === 0 && !wallsLoading && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 font-raleway mb-2">No walls found</h3>
            <p className="text-gray-500 font-raleway">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ModernWalls;