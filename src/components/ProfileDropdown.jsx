import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdPerson, MdSettings, MdLogout, MdDashboard } from 'react-icons/md';
import AuthService from '@services/AuthService';

const ProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    navigate('/ProfileSettings');
  };

  const handleDashboardClick = () => {
    setIsOpen(false);
    navigate('/admin/dashboard');
  };

  const getUserInitials = () => {
    if (user?.profile?.first_name && user?.profile?.last_name) {
      return `${user.profile.first_name[0]}${user.profile.last_name[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user?.profile?.first_name && user?.profile?.last_name) {
      return `${user.profile.first_name} ${user.profile.last_name}`;
    }
    if (user?.username) {
      return user.username;
    }
    return 'User';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg font-raleway font-medium text-sm transition-all duration-300 text-white/70 hover:text-white hover:bg-white/5"
      >
        {/* Profile Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {getUserInitials()}
        </div>
        
        {/* User Name */}
        <span className="hidden sm:block">{getUserDisplayName()}</span>
        
        {/* Dropdown Arrow */}
        {isOpen ? (
          <MdKeyboardArrowUp className="w-4 h-4 transition-transform duration-200" />
        ) : (
          <MdKeyboardArrowDown className="w-4 h-4 transition-transform duration-200" />
        )}
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full right-0 mt-2 bg-indigo-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl z-[300] min-w-[200px] transition-all duration-300 ${
          isOpen
            ? "opacity-100 visible transform translate-y-0"
            : "opacity-0 invisible transform -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="p-2">
          {/* User Info Header */}
          <div className="px-3 py-2 border-b border-white/10 mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {getUserInitials()}
              </div>
              <div>
                <div className="text-white font-medium text-sm">{getUserDisplayName()}</div>
                <div className="text-white/60 text-xs">{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <ul className="space-y-1">
            <li>
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-raleway font-medium text-sm transition-all duration-300 text-white/70 hover:text-white hover:bg-white/5 text-left"
              >
                <MdPerson className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </li>
            
            <li>
              <button
                onClick={handleSettingsClick}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-raleway font-medium text-sm transition-all duration-300 text-white/70 hover:text-white hover:bg-white/5 text-left"
              >
                <MdSettings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </li>

            {/* Admin Dashboard - Only show for admin users */}
            {user?.role === 'admin' && (
              <li>
                <button
                  onClick={handleDashboardClick}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-raleway font-medium text-sm transition-all duration-300 text-white/70 hover:text-white hover:bg-white/5 text-left"
                >
                  <MdDashboard className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </button>
              </li>
            )}

            <li className="border-t border-white/10 pt-1 mt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-raleway font-medium text-sm transition-all duration-300 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-left"
              >
                <MdLogout className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
