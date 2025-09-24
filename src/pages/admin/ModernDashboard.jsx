import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faImage,
  faNewspaper,
  faMapMarkerAlt,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../hooks/redux';
import { useGetAdminStatsQuery } from '../../store/api/muralFinderApi';
import AdminLayout from '../../components/layout/AdminLayout';

const ModernAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Use Redux Query for data fetching
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError
  } = useGetAdminStatsQuery();

  // Extract statistics with fallback values - accessing nested data structure
  const statistics = statsData?.data || {
    userCount: 0,
    artworkCount: 0,
    wallsCount: 0,
    postCount: 0,
  };



  const statsCards = [
    {
      title: 'Total Users',
      value: statistics.userCount || 0,
      icon: faUsers,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      route: '/admin/users'
    },
    {
      title: 'Artworks',
      value: statistics.artworkCount || 0,
      icon: faImage,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      route: '/admin/artworks'
    },
    {
      title: 'Walls',
      value: statistics.wallsCount || 0,
      icon: faMapMarkerAlt,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      route: '/admin/walls'
    },
    {
      title: 'Posts',
      value: statistics.postCount || 0,
      icon: faNewspaper,
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      route: '/admin/posts'
    }
  ];



  if (statsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-indigo-600 mb-4" />
            <p className="text-gray-600 font-raleway">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 font-raleway mb-2">
              Welcome back, {user?.first_name || user?.username || 'Admin'}!
            </h3>
            <p className="text-gray-600 font-raleway">
              Here's what's happening with your platform today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => (
              <div
                key={index}
                onClick={() => navigate(card.route)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-raleway">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 font-raleway mt-2">
                      {card.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <FontAwesomeIcon 
                      icon={card.icon} 
                      className={`text-xl ${card.textColor}`} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 font-raleway mb-4">
                Quick Actions
              </h4>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/users')}
                  className="w-full flex items-center justify-between p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-raleway text-gray-700">Manage Users</span>
                  <FontAwesomeIcon icon={faUsers} className="text-gray-400" />
                </button>
                <button
                  onClick={() => navigate('/admin/artworks')}
                  className="w-full flex items-center justify-between p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-raleway text-gray-700">Review Artworks</span>
                  <FontAwesomeIcon icon={faImage} className="text-gray-400" />
                </button>
                <button
                  onClick={() => navigate('/admin/walls')}
                  className="w-full flex items-center justify-between p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-raleway text-gray-700">Manage Walls</span>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 font-raleway mb-4">
                Recent Activity
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 font-raleway">
                    System running smoothly
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 font-raleway">
                    {statistics.userCount || 0} total users registered
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 font-raleway">
                    {statistics.artworkCount || 0} artworks uploaded
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </AdminLayout>
  );
};

export default ModernAdminDashboard;
