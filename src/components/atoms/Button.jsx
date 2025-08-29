import React from 'react';
import { useTheme } from '../../hooks/redux';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const { theme } = useTheme();

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const variants = {
    primary: `
      bg-blue-600 hover:bg-blue-700 text-white
      focus:ring-blue-500 shadow-sm hover:shadow-md
      ${theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : ''}
    `,
    secondary: `
      bg-gray-200 hover:bg-gray-300 text-gray-900
      focus:ring-gray-500 shadow-sm hover:shadow-md
      ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : ''}
    `,
    outline: `
      border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white
      focus:ring-blue-500 bg-transparent
      ${theme === 'dark' ? 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900' : ''}
    `,
    ghost: `
      text-gray-700 hover:bg-gray-100 hover:text-gray-900
      focus:ring-gray-500 bg-transparent
      ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : ''}
    `,
    danger: `
      bg-red-600 hover:bg-red-700 text-white
      focus:ring-red-500 shadow-sm hover:shadow-md
      ${theme === 'dark' ? 'bg-red-500 hover:bg-red-600' : ''}
    `,
    success: `
      bg-green-600 hover:bg-green-700 text-white
      focus:ring-green-500 shadow-sm hover:shadow-md
      ${theme === 'dark' ? 'bg-green-500 hover:bg-green-600' : ''}
    `,
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-5 h-5',
  };

  const LoadingSpinner = () => (
    <svg
      className={`animate-spin ${iconSizes[size]} ${iconPosition === 'right' ? 'ml-2' : 'mr-2'}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const IconComponent = () => {
    if (loading) return <LoadingSpinner />;
    if (!icon) return null;
    
    return React.cloneElement(icon, {
      className: `${iconSizes[size]} ${iconPosition === 'right' ? 'ml-2' : 'mr-2'}`
    });
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {iconPosition === 'left' && <IconComponent />}
      {children}
      {iconPosition === 'right' && <IconComponent />}
    </button>
  );
};

export default Button;
