import React, { forwardRef } from 'react';
import { useTheme } from '../../hooks/redux';

const Input = forwardRef(({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  size = 'md',
  variant = 'default',
  fullWidth = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const { theme } = useTheme();

  const baseClasses = `
    block border rounded-lg transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const variants = {
    default: `
      border-gray-300 focus:border-blue-500 focus:ring-blue-500
      ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
    `,
    filled: `
      border-transparent bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-blue-500
      ${theme === 'dark' ? 'bg-gray-700 focus:bg-gray-800 text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}
      ${error ? 'bg-red-50 focus:bg-white border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
    `,
    outlined: `
      border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-transparent
      ${theme === 'dark' ? 'border-gray-600 text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'}
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
    `,
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-5 h-5',
  };

  const IconComponent = () => {
    if (!icon) return null;
    
    return (
      <div className={`
        absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'}
        flex items-center pointer-events-none
      `}>
        {React.cloneElement(icon, {
          className: `${iconSizes[size]} ${error ? 'text-red-500' : 'text-gray-400'}`
        })}
      </div>
    );
  };

  const inputPadding = icon 
    ? iconPosition === 'left' 
      ? 'pl-10' 
      : 'pr-10'
    : '';

  return (
    <div className={`${containerClassName}`}>
      {label && (
        <label className={`
          block text-sm font-medium mb-2
          ${error ? 'text-red-700' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
        `}>
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          className={`
            ${baseClasses}
            ${variants[variant]}
            ${sizes[size]}
            ${inputPadding}
            ${className}
          `}
          {...props}
        />
        <IconComponent />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className={`
          mt-1 text-sm
          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
        `}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
