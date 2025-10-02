import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth, useTheme, useNotifications } from '../../hooks/redux';
import { logoutUser } from '../../store/slices/authSlice';
import { openModal, toggleMobileMenu } from '../../store/slices/uiSlice';
import SearchBar from '../molecules/SearchBar';
import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();

  const handleLogin = () => {
    dispatch(openModal('loginModal'));
  };

  const handleSignup = () => {
    dispatch(openModal('signupModal'));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  const NotificationIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 19.718A8.966 8.966 0 0112 17a8.966 8.966 0 017.132 2.718M12 9a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  );

  const SunIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const MoonIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );

  const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  return (
    <header className={`
      sticky top-0 z-40 border-b backdrop-blur-sm
      ${theme === 'dark' 
        ? 'bg-gray-900/95 border-gray-700' 
        : 'bg-white/95 border-gray-200'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={handleLogoClick}
              className="flex items-center text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MF</span>
              </div>
            </button>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              icon={theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              className="hidden sm:flex"
            />

            {isAuthenticated ? (
              <>
                {/* Add Content Button */}
                <Button
                  variant="primary"
                  size="sm"
                  icon={<PlusIcon />}
                  onClick={() => dispatch(openModal('addArtworkModal'))}
                  className="hidden sm:flex"
                >
                  Add
                </Button>

                {/* Notifications */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNotificationsClick}
                    icon={<NotificationIcon />}
                    className={isActive('/notifications') ? 'bg-blue-50 text-blue-600' : ''}
                  />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                  )}
                </div>

                {/* Profile Menu */}
                <div className="relative group">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Avatar
                      src={user?.profile?.profile_image_url}
                      alt={user?.username}
                      size="sm"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <div className={`
                    absolute right-0 mt-2 w-48 rounded-md shadow-lg opacity-0 invisible
                    group-hover:opacity-100 group-hover:visible transition-all duration-200
                    ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                    border
                  `}>
                    <div className="py-1">
                      <button
                        onClick={handleProfileClick}
                        className={`
                          block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                          ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                        `}
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => navigate('/settings')}
                        className={`
                          block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                          ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                        `}
                      >
                        Settings
                      </button>
                      <hr className="my-1 border-gray-200 dark:border-gray-600" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSignup}
                >
                  Sign Up
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(toggleMobileMenu())}
              icon={<MenuIcon />}
              className="md:hidden"
            />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Header;
