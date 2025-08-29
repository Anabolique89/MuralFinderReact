import React from 'react';
import { useTheme } from '../../hooks/redux';
import Header from '../organisms/Header';
import NotificationToast from '../ui/NotificationToast';

const ModernLayout = ({ children, showHeader = true, className = '' }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'
    } ${className}`}>
      {showHeader && <Header />}
      
      <main className="flex-1">
        {children}
      </main>

      {/* Global Notifications */}
      <NotificationToast />
    </div>
  );
};

export default ModernLayout;
