import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth, useTheme } from '../../hooks/redux';
import { setOnlineStatus } from '../../store/slices/uiSlice';
import ModernLayout from './ModernLayout';

const ModernRoute = ({ 
  children, 
  requireAuth = false, 
  showHeader = true,
  title,
  className = '' 
}) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => dispatch(setOnlineStatus(true));
    const handleOffline = () => dispatch(setOnlineStatus(false));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Set page title
  useEffect(() => {
    if (title) {
      document.title = `${title} - MuralFinder`;
    }
  }, [title]);

  // Handle authentication requirement
  if (requireAuth && !isAuthenticated) {
    return (
      <ModernLayout showHeader={showHeader} className={className}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className={`text-2xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Authentication Required
            </h2>
            <p className={`mb-6 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Please log in to access this page.
            </p>
            <button
              onClick={() => dispatch({ type: 'ui/openModal', payload: 'loginModal' })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Log In
            </button>
          </div>
        </div>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout showHeader={showHeader} className={className}>
      {children}
    </ModernLayout>
  );
};

export default ModernRoute;
