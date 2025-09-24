import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faImage,
  faNewspaper,
  faMapMarkerAlt,
  faChartLine,
  faCog,
  faSignOutAlt,
  faBars,
  faTimes,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../hooks/redux';
import AuthService from '../../services/AuthService';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const sidebarItems = [
    { title: 'Dashboard', icon: faChartLine, route: '/admin/dashboard' },
    { title: 'Users', icon: faUsers, route: '/admin/users' },
    { title: 'Artworks', icon: faImage, route: '/admin/artworks' },
    { title: 'Walls', icon: faMapMarkerAlt, route: '/admin/walls' },
    { title: 'Posts', icon: faNewspaper, route: '/admin/posts' },
    { title: 'Trash', icon: faTrash, route: '/admin/trash' },
    { title: 'Settings', icon: faCog, route: '/admin/settings' },
  ];

  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 font-raleway">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                navigate(item.route);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                isActiveRoute(item.route)
                  ? 'bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="mr-3" />
              <span className="font-raleway">{item.title}</span>
            </button>
          ))}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-left text-red-600 hover:bg-red-50 transition-colors mt-6"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
            <span className="font-raleway">Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 font-raleway">
                {sidebarItems.find(item => isActiveRoute(item.route))?.title || 'Admin'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 font-raleway">
                  {user?.first_name || user?.username || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 font-raleway capitalize">
                  {user?.role || 'Administrator'}
                </p>
              </div>
              <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {(user?.first_name?.[0] || user?.username?.[0] || 'A').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
