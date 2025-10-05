import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth, useTheme } from '../../hooks/redux';
import { registerUser, clearError, clearRegistrationSuccess } from '../../store/slices/authSlice';
import { addNotification } from '../../store/slices/uiSlice';
import { ModernRoute, ModernButton, NotificationToast } from '../../components';
import { fadeintoyouWhite } from '../../assets';
import { getAuthUrl } from '../../utils/apiConfig';

// Enhanced ModernInput component with password visibility toggle
const ModernInputWithToggle = ({ 
  label, 
  name, 
  type, 
  value, 
  onChange, 
  error, 
  icon, 
  placeholder, 
  fullWidth, 
  autoComplete,
  helperText 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  const EyeIcon = ({ show }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-raleway font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} ${isPasswordField ? 'pr-10' : 'pr-4'} py-3 border rounded-lg font-raleway focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            error
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <EyeIcon show={showPassword} />
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 font-raleway">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500 font-raleway">{helperText}</p>
      )}
    </div>
  );
};

const ModernSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isAuthenticated, isLoading, error, registrationSuccess } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle registration success with email verification reminder
  useEffect(() => {
    console.log('Registration success state:', registrationSuccess);
    
    if (registrationSuccess) {
      console.log('Showing registration success notification');
      
      // Show comprehensive success notification
      dispatch(addNotification({
        type: 'success',
        message: '✅ Account created successfully! Please check your email inbox (and spam folder) for a verification link to activate your account.',
        duration: 10000, // Show for 10 seconds so user has time to read
      }));
      
      // Wait 3 seconds before navigating
      const timer = setTimeout(() => {
        console.log('Navigating to login page');
        navigate('/login');
        dispatch(clearRegistrationSuccess());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, navigate, dispatch]);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearError());
    
    return () => {
      dispatch(clearError());
      dispatch(clearRegistrationSuccess());
    };
  }, [dispatch]);

  // Show error notifications
  useEffect(() => {
    if (error) {
      dispatch(addNotification({
        type: 'error',
        message: error,
        duration: 6000,
      }));
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const errors = {};

    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 20) {
      errors.username = 'Username must not exceed 20 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and a number';
    }

    if (!formData.password_confirmation) {
      errors.password_confirmation = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
    }

    if (!formData.role) {
      errors.role = 'Please select your role';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      dispatch(addNotification({
        type: 'error',
        message: 'Please fix the errors in the form before submitting',
        duration: 4000,
      }));
      return;
    }

    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      console.log('Registration successful, result:', result);
      
      // Manual notification as immediate feedback
      dispatch(addNotification({
        type: 'success',
        message: '✅ Account created! Please check your email (including spam folder) to verify your account.',
        duration: 10000,
      }));
      
      // Navigate after delay
      setTimeout(() => {
        navigate('/login');
        dispatch(clearRegistrationSuccess());
      }, 3000);
      
    } catch (error) {
      console.error('Registration failed:', error);
      // Error is handled by Redux and useEffect above
    }
  };

  const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const EmailIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
  );

  const LockIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  return (
    <ModernRoute title="Sign Up" showHeader={false}>
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center pt-20 px-4">
        <div className="w-full max-w-5xl flex rounded-lg overflow-hidden shadow-xl my-8">
        {/* Left Side - Blue Background with Image */}
        <div className="hidden lg:block relative w-0 flex-1 bg-indigo-600 min-h-[700px] p-8">
          <div className="h-full flex items-center justify-center">
            <img
              className="w-4/5 max-h-[80%] object-contain transition-transform duration-700 hover:scale-110"
              src={fadeintoyouWhite}
              alt="Street art community"
            />
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-4 h-4 bg-secondary/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-2 h-2 bg-secondary/40 rounded-full animate-ping"></div>
          <div className="absolute bottom-40 left-1/3 w-3 h-3 bg-secondary/30 rounded-full animate-bounce"></div>

          <div className="absolute bottom-8 left-8 text-white animate-slide-in-left">
            <h3 className="text-2xl font-raleway font-bold mb-2 text-white">
              Join the Community
            </h3>
            <p className="text-lg font-raleway text-dimWhite opacity-90 mb-4">Share your art and discover amazing murals worldwide</p>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-0.5 bg-blue-gradient rounded-full"></div>
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              <div className="w-8 h-0.5 bg-blue-gradient rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* Header */}
            <div className="text-center mb-8 animate-slide-in-up">
              <h2 className={`text-3xl font-raleway font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Create your account
              </h2>
              <p className={`mt-2 text-sm font-raleway ${
                theme === 'dark' ? 'text-dimWhite' : 'text-gray-600'
              }`}>
                Join the global street art community
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <div className="w-8 h-0.5 bg-blue-gradient rounded-full"></div>
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                <div className="w-8 h-0.5 bg-blue-gradient rounded-full"></div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <ModernInputWithToggle
                label="Username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                error={formErrors.username}
                icon={<UserIcon />}
                placeholder="Choose a username"
                fullWidth
                autoComplete="username"
              />

              <ModernInputWithToggle
                label="Email address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={formErrors.email}
                icon={<EmailIcon />}
                placeholder="Enter your email"
                fullWidth
                autoComplete="email"
              />

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-raleway font-medium text-gray-700">
                  Select your role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg font-raleway focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    formErrors.role
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  required
                >
                  <option value="">Select a role</option>
                  <option value="artist">Artist</option>
                  <option value="artlover">Art Lover</option>
                  <option value="moderator">Moderator</option>
                </select>
                {formErrors.role && (
                  <p className="text-red-500 text-sm font-raleway">{formErrors.role}</p>
                )}
              </div>

              <ModernInputWithToggle
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={formErrors.password}
                icon={<LockIcon />}
                placeholder="Create a password"
                fullWidth
                autoComplete="new-password"
                helperText="Must be at least 8 characters with uppercase, lowercase, and number"
              />

              <ModernInputWithToggle
                label="Confirm Password"
                name="password_confirmation"
                type="password"
                value={formData.password_confirmation}
                onChange={handleInputChange}
                error={formErrors.password_confirmation}
                icon={<LockIcon />}
                placeholder="Confirm your password"
                fullWidth
                autoComplete="new-password"
              />

              <div className="flex items-center">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="agree-terms" className={`ml-2 block text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                }`}>
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <ModernButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
              >
                Create account
              </ModernButton>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${
                    theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                  }`} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${
                    theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-gray-50 text-gray-500'
                  }`}>
                    Or sign up with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <ModernButton
                  variant="outline"
                  onClick={() => window.location.href = getAuthUrl('google')}
                  className="w-full"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </ModernButton>

                <ModernButton
                  variant="outline"
                  onClick={() => window.location.href = getAuthUrl('facebook')}
                  className="w-full"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </ModernButton>
              </div>
            </div>

            {/* Sign in link */}
            <p className={`mt-6 text-center text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
        </div>
      </div>
      
      {/* Global Notifications */}
      <NotificationToast />
    </ModernRoute>
  );
};

export default ModernSignup;