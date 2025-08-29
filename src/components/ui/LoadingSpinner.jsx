import React from 'react';
import { useUI } from '../../hooks/redux';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  text = null,
  className = '',
  overlay = false 
}) => {
  const { theme } = useUI();
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };
  
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    accent: 'text-purple-600'
  };
  
  const spinnerElement = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`
          animate-spin rounded-full border-2 border-gray-300 border-t-current
          ${sizeClasses[size]} ${colorClasses[color]}
        `}
      />
      {text && (
        <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {text}
        </p>
      )}
    </div>
  );
  
  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
          {spinnerElement}
        </div>
      </div>
    );
  }
  
  return spinnerElement;
};

export default LoadingSpinner;
