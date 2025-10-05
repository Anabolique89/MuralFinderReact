import React, { forwardRef, useState } from 'react';
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
  type = 'text',
  ...props
}, ref) => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

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

  const EyeIcon = ({ show }) => (
    <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {show ? (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
        />
      ) : (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
        />
      )}
    </svg>
  );

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

  const PasswordToggle = () => {
    if (!isPasswordField) return null;
    
    return (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className={`
          absolute inset-y-0 right-0 pr-3
          flex items-center
          ${error ? 'text-red-500' : 'text-gray-400'}
          hover:text-gray-600 dark:hover:text-gray-300
          transition-colors focus:outline-none
        `}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        <EyeIcon show={showPassword} />
      </button>
    );
  };

  // Calculate padding based on icons
  let inputPadding = '';
  if (icon && iconPosition === 'left') {
    inputPadding = isPasswordField ? 'pl-10 pr-10' : 'pl-10';
  } else if (icon && iconPosition === 'right') {
    inputPadding = 'pr-10';
  } else if (isPasswordField) {
    inputPadding = 'pr-10';
  }

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
          type={inputType}
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
        <PasswordToggle />
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

Input.displayName = 'ModernInput';

export default Input;