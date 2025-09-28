import React, { useState } from 'react';
import { useTheme } from '../../hooks/redux';

const Avatar = ({
  src,
  alt,
  size = 'md',
  fallback,
  online = false,
  className = '',
  onClick,
  ...props
}) => {
  const { theme } = useTheme();
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
    '3xl': 'w-24 h-24',
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl',
    '3xl': 'text-2xl',
  };

  const onlineIndicatorSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
    '3xl': 'w-5 h-5',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const baseClasses = `
    relative inline-flex items-center justify-center
    rounded-full overflow-hidden
    ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
    ${sizes[size]}
  `;

  const fallbackClasses = `
    flex items-center justify-center w-full h-full
    font-medium
    ${theme === 'dark' 
      ? 'bg-gray-700 text-gray-300' 
      : 'bg-gray-200 text-gray-600'
    }
    ${textSizes[size]}
  `;

  return (
    <div
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={fallbackClasses}>
          {fallback || getInitials(alt)}
        </div>
      )}
      
      {online && (
        <div className={`
          absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4
          ${onlineIndicatorSizes[size]}
          bg-green-500 border-2 border-white rounded-full
          ${theme === 'dark' ? 'border-gray-800' : 'border-white'}
        `} />
      )}
    </div>
  );
};

export default Avatar;
