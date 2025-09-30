import  { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth, useTheme } from '../../hooks/redux';
import { loginUser, clearError, resetLoading, clearAuth } from '../../store/slices/authSlice';
import { addNotification } from '../../store/slices/uiSlice';
import { ModernRoute, ModernInput, ModernButton } from '../../components';
import { fadeintoyouWhite } from '../../assets';
import AuthService from '../../services/AuthService';

const ModernLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { isAuthenticated, isLoading, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Redirect if already authenticated based on user role (runs after token clearing)
  useEffect(() => {
    console.log('Auth redirect check - isAuthenticated:', isAuthenticated, 'AuthService.isAuthenticated():', AuthService.isAuthenticated());
    console.log('Redux auth state:', { isAuthenticated, isLoading, error });
    
    // Only check for redirect if we're authenticated AND have valid tokens
    if (isAuthenticated && AuthService.isAuthenticated()) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userRole = user.role;

      // Determine redirect path based on role
      let redirectPath = '/profile'; // default for regular users

      if (userRole === 'admin') {
        redirectPath = '/admin/dashboard';
      } else if (userRole === 'artist') {
        redirectPath = '/profile';
      } else if (userRole === 'artlover') {
        redirectPath = '/profile';
      }

      // Use intended path if available, otherwise use role-based path
      const from = location.state?.from?.pathname || redirectPath;
      console.log('Redirecting authenticated user to:', from);
      navigate(from, { replace: true });
    } else {
      console.log('Not redirecting - authentication check failed');
    }
  }, [isAuthenticated, navigate, location]);

  // Handle URL params for social login and email verification
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const verified = urlParams.get('verified');
    
    // Handle email verification status
    if (verified === '1') {
      dispatch(addNotification({
        type: 'success',
        message: 'Email verified successfully! You can now log in.',
        duration: 5000,
      }));
    } else if (verified === '0') {
      dispatch(addNotification({
        type: 'error',
        message: 'Email verification failed. Please try again or request a new verification email.',
        duration: 5000,
      }));
    }
    const user = urlParams.get('user');

    if (token && user) {
      // Handle social login success
      localStorage.setItem('token', token);
      const userData = JSON.parse(user);
      localStorage.setItem('user', user);

      dispatch(addNotification({
        type: 'success',
        message: 'Successfully logged in!',
      }));

      // Determine redirect path based on role
      let redirectPath = '/profile'; // default for regular users

      if (userData.role === 'admin') {
        redirectPath = '/admin/dashboard';
      } else if (userData.role === 'artist') {
        redirectPath = '/profile';
      } else if (userData.role === 'artlover') {
        redirectPath = '/profile';
      }

      navigate(redirectPath);
    }
  }, [location.search, navigate, dispatch]);

  // Clear errors and reset loading state when component mounts
  useEffect(() => {
    dispatch(clearError());
    dispatch(resetLoading());
    
    // For Laravel Sanctum tokens, we can't validate expiration on frontend
    // The backend will handle expiration validation
    // Debug log to check loading state
    console.log('Login component mounted - isLoading:', isLoading);
  }, [dispatch, isLoading]);

  // Show error notifications
  useEffect(() => {
    console.log('Error state changed:', error);
    if (error) {
      console.log('Dispatching error notification:', error);
      dispatch(addNotification({
        type: 'error',
        message: error,
        duration: 5000,
      }));
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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
    console.log('Login form submitted with data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsSubmitting(true);
    console.log('Form validation passed, attempting login...');
    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      
      console.log('Login result:', result);

      // Store token and user data in localStorage for AuthService compatibility
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Store refresh token if available
      if (result.tokens?.refresh_token) {
        localStorage.setItem('refresh_token', result.tokens.refresh_token);
        console.log('Refresh token stored:', result.tokens.refresh_token);
      }
      
      console.log('Token stored in localStorage:', localStorage.getItem('token'));
      console.log('User stored in localStorage:', localStorage.getItem('user'));

      dispatch(addNotification({
        type: 'success',
        message: 'Welcome back!',
      }));

      // Don't navigate here - let the useEffect handle the redirect
      // after Redux state is updated
      console.log('Login successful, Redux state will trigger redirect');
    } catch (error) {
      console.error('Login error caught in handleSubmit:', error);
      console.error('Error message:', error.message);
      console.error('Error type:', typeof error);
      // Error is handled by the slice and useEffect above
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <ModernRoute title="Login" showHeader={false}>
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center pt-20 px-4">
        <div className="w-full max-w-5xl flex rounded-lg overflow-hidden shadow-xl my-8">
        {/* Left Side - Blue Background with Image */}
        <div className="hidden lg:block relative w-0 flex-1 bg-indigo-600 min-h-[600px] p-8">
          <div className="h-full flex items-center justify-center">
            <img
              className="w-4/5 max-h-[80%] object-contain transition-transform duration-700 hover:scale-110"
              src={fadeintoyouWhite}
              alt="Street art community"
            />
          </div>


          {/* Floating Elements with Original Colors */}
          <div className="absolute top-20 left-20 w-4 h-4 bg-secondary/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-2 h-2 bg-secondary/40 rounded-full animate-ping"></div>
          <div className="absolute bottom-40 left-1/3 w-3 h-3 bg-secondary/30 rounded-full animate-bounce"></div>

          <div className="absolute bottom-8 left-8 text-white animate-slide-in-left">
            <h3 className="text-2xl font-raleway font-bold mb-2 text-white">
              Welcome Back
            </h3>
            <p className="text-lg font-raleway text-dimWhite opacity-90 mb-4">Sign in to continue your artistic journey</p>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-0.5 bg-blue-gradient rounded-full"></div>
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              <div className="w-8 h-0.5 bg-blue-gradient rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white min-h-[600px]">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* Header */}
            <div className="text-center mb-8 animate-slide-in-up">
              <h2 className={`text-3xl font-raleway font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Welcome back
              </h2>
              <p className={`mt-2 text-sm font-raleway ${
                theme === 'dark' ? 'text-dimWhite' : 'text-gray-600'
              }`}>
                Sign in to your account to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 animate-slide-in-up" style={{animationDelay: '0.2s'}}>
              <ModernInput
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

              <ModernInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={formErrors.password}
                icon={<LockIcon />}
                placeholder="Enter your password"
                fullWidth
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className={`ml-2 block text-sm font-raleway ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-raleway font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-raleway">
                  Error: {error}
                </div>
              )}
              {console.log('Rendering form - error state:', error)}

              <ModernButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isSubmitting}
                className="bg-blue-gradient text-primary font-raleway font-bold uppercase"
              >
                {isSubmitting ? 'Signing In...' : 'Sign in'}
              </ModernButton>

              <div className="text-center">
                <p className={`text-sm font-raleway ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Don&apos;t have an account?{' '}
                  <Link
                    to="/Signup"
                    className="font-raleway font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        </div>
      </div>
    </ModernRoute>
  );
};

export default ModernLogin;
