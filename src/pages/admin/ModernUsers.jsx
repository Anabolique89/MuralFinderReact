import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faSearch,
  faFilter,
  faEye,
  faEdit,
  faTrash,
  faSpinner,
  faUserPlus,
  faSort,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../components/layout/AdminLayout';
import {
  useGetAdminUsersQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useBanUserMutation,
  useUnbanUserMutation
} from '../../store/api/muralFinderApi';
import { useToast } from '../../contexts/ToastContext';

const ModernUsers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Use Redux Query for data fetching - using admin user statistics endpoint
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError
  } = useGetAdminUsersQuery({
    page: currentPage,
  });

  // Extract data with fallbacks - accessing nested data structure
  // The admin/statistics/users endpoint returns userStatistics array
  const allUsers = usersData?.data?.userStatistics || [];
  const totalPages = usersData?.data?.lastPage || 1;
  const currentPageFromAPI = usersData?.data?.currentPage || 1;

  // Apply client-side filtering
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = !searchTerm ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const users = filteredUsers;

  // Mutation hooks for CRUD operations
  const [deleteUser] = useDeleteUserMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [banUser] = useBanUserMutation();
  const [unbanUser] = useUnbanUserMutation();

  // Toast notifications
  const toast = useToast();

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Action handlers
  const handleDeleteUser = async (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      try {
        await deleteUser(userId).unwrap();
        toast.success(`User "${username}" deleted successfully`, 'User Deleted');
      } catch (error) {
        toast.error(error.data?.message || error.message || 'Failed to delete user', 'Delete Failed');
      }
    }
  };

  const handleUpdateRole = async (userId, newRole, username) => {
    if (window.confirm(`Change role for "${username}" to "${newRole}"?`)) {
      try {
        await updateUserRole({ userId, role: newRole }).unwrap();
        toast.success(`Role updated to "${newRole}" for "${username}"`, 'Role Updated');
      } catch (error) {
        toast.error(error.data?.message || error.message || 'Failed to update role', 'Update Failed');
      }
    }
  };

  const handleBanUser = async (userId, username) => {
    if (window.confirm(`Ban user "${username}"?`)) {
      try {
        await banUser(userId).unwrap();
        toast.warning(`User "${username}" has been banned`, 'User Banned');
      } catch (error) {
        toast.error(error.data?.message || error.message || 'Failed to ban user', 'Ban Failed');
      }
    }
  };

  const handleUnbanUser = async (userId, username) => {
    if (window.confirm(`Unban user "${username}"?`)) {
      try {
        await unbanUser(userId).unwrap();
        toast.success(`User "${username}" has been unbanned`, 'User Unbanned');
      } catch (error) {
        toast.error(error.data?.message || error.message || 'Failed to unban user', 'Unban Failed');
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'artist':
        return 'bg-purple-100 text-purple-800';
      case 'artlover':
        return 'bg-blue-100 text-blue-800';
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

  if (usersLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-indigo-600 mb-4" />
            <p className="text-gray-600 font-raleway">Loading users...</p>
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
              <h1 className="text-2xl font-bold text-gray-900 font-raleway">Users Management</h1>
              <p className="text-gray-600 font-raleway mt-1">Manage and monitor user accounts</p>
            </div>
            <button
              onClick={() => navigate('/admin/users/add')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-raleway font-semibold flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faUserPlus} />
              <span>Add User</span>
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-raleway"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="artist">Artist</option>
                <option value="artlover">Art Lover</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('username')}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      <span>User</span>
                      <FontAwesomeIcon icon={faSort} className="text-xs" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('email')}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      <span>Email</span>
                      <FontAwesomeIcon icon={faSort} className="text-xs" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('role')}
                      className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      <span>Role</span>
                      <FontAwesomeIcon icon={faSort} className="text-xs" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Social
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {(user.profile?.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 font-raleway">
                            {user.profile?.first_name && user.profile?.last_name
                              ? `${user.profile.first_name} ${user.profile.last_name}`
                              : user.username
                            }
                          </div>
                          <div className="text-sm text-gray-500 font-raleway">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-raleway">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-raleway">
                        <div>Posts: {user.postsCount || 0}</div>
                        <div>Artworks: {user.artworksCount || 0}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-raleway">
                        <div>Followers: {user.followersCount || 0}</div>
                        <div>Following: {user.followingsCount || 0}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => window.open(`/profile/${user.username}`, '_blank')}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="View Profile"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>

                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value, user.username)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                          title="Change Role"
                        >
                          <option value="admin">Admin</option>
                          <option value="artist">Artist</option>
                          <option value="artlover">Art Lover</option>
                        </select>

                        {user.status !== 'banned' ? (
                          <button
                            onClick={() => handleBanUser(user.id, user.username)}
                            className="text-orange-600 hover:text-orange-900 p-1"
                            title="Ban User"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnbanUser(user.id, user.username)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Unban User"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete User"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
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
        </div>

        {users.length === 0 && !usersLoading && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faUsers} className="text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 font-raleway mb-2">No users found</h3>
            <p className="text-gray-500 font-raleway">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ModernUsers;
