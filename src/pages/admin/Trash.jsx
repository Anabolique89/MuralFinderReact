import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faUndo,
  faSpinner,
  faImage,
  faUsers,
  faMapMarkerAlt,
  faNewspaper,
  faSearch,
  faFilter,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/layout/AdminLayout';
import TrashService from '../../services/TrashService';
import { toast } from 'react-toastify';
import { getFileUrl } from '../../utils/apiConfig';

const Trash = () => {
  const [trashedItems, setTrashedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTrashedItems();
  }, []);

  const fetchTrashedItems = async () => {
    try {
      setLoading(true);
      const response = await TrashService.getAll();
      setTrashedItems(response.data);
    } catch (error) {
      console.error('Error fetching trashed items:', error);
      toast.error('Failed to load trashed items');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (model, id) => {
    try {
      setActionLoading(true);
      await TrashService.restore(model, id);
      toast.success('Item restored successfully!');
      fetchTrashedItems();
    } catch (error) {
      console.error('Error restoring item:', error);
      toast.error('Failed to restore item');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePermanentDelete = async (model, id) => {
    if (!window.confirm('Are you sure you want to permanently delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(true);
      await TrashService.delete(model, id);
      toast.success('Item permanently deleted!');
      fetchTrashedItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    } finally {
      setActionLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'artworks': return faImage;
      case 'users': return faUsers;
      case 'walls': return faMapMarkerAlt;
      case 'posts': return faNewspaper;
      default: return faTrash;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderTrashCard = (item, type) => (
    <div key={`${type}-${item.id}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={getTypeIcon(type)} className="text-gray-600" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 font-raleway truncate">
                {item.title || item.name || item.username || `${type.slice(0, -1)} #${item.id}`}
              </h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {type.slice(0, -1)}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {item.description || item.email || item.location_text || 'No description available'}
            </p>

            <div className="flex items-center text-xs text-gray-500 space-x-4">
              <span className="flex items-center space-x-1">
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>Deleted: {formatDate(item.deleted_at)}</span>
              </span>
              {item.user && (
                <span>By: {item.user.username}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => handleRestore(type, item.id)}
            disabled={actionLoading}
            className="inline-flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faUndo} className="mr-2" />
            Restore
          </button>

          <button
            onClick={() => handlePermanentDelete(type, item.id)}
            disabled={actionLoading}
            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const getAllItems = () => {
    const allItems = [];
    Object.entries(trashedItems).forEach(([type, items]) => {
      if (Array.isArray(items)) {
        items.forEach(item => {
          allItems.push({ ...item, type });
        });
      }
    });
    return allItems;
  };

  const filteredItems = getAllItems().filter(item => {
    const matchesSearch = searchTerm === '' ||
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.username && item.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterType === 'all' || item.type === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-raleway">Trash Management</h1>
              <p className="text-gray-600 font-raleway mt-1">Restore or permanently delete trashed items</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search trashed items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Filter by type */}
            <div className="relative">
              <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Types</option>
                <option value="artworks">Artworks</option>
                <option value="users">Users</option>
                <option value="walls">Walls</option>
                <option value="posts">Posts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FontAwesomeIcon icon={faSpinner} spin className="text-2xl text-indigo-600" />
            <span className="ml-3 text-gray-600 font-raleway">Loading trashed items...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FontAwesomeIcon icon={faTrash} className="text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 font-raleway mb-2">No trashed items found</h3>
            <p className="text-gray-600 font-raleway">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'All items are in their proper place!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map(item => renderTrashCard(item, item.type))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Trash;