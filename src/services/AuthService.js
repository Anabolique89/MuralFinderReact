import axios from "axios";
import { BASE_URL, authEndpoints } from "../constants/ApiEndpoints";

const AuthService = {
  login: async (email, password) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const inputObj = { email, password };
      console.log('AuthService.login called with:', inputObj);
      console.log('API URL:', `${BASE_URL}${authEndpoints.login}`);

      const response = await fetch(`${BASE_URL}${authEndpoints.login}`, {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(inputObj)
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (response.ok) {
        const dataObj = data.data;
        // Handle both token structures from backend
        const token = dataObj.tokens?.access_token || dataObj.token;
        console.log('Extracted token:', token);

        if (token) {
          // Store token in localStorage for backward compatibility
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(dataObj.user));
        }

        return {
          user: dataObj.user,
          token: token,
          tokens: dataObj.tokens // Include full tokens object
        };
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      throw err;
    }
  },

  signup: async (username, email, role, password, passwordConfirmation) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const inputObj = {
        username,
        email,
        role,
        password,
        password_confirmation: passwordConfirmation
      };

      const response = await fetch(`${BASE_URL}${authEndpoints.register}`, {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(inputObj)
      });

      const data = await response.json();

      if (response.ok) {
        return { message: data.message };
      } else {
        if (data && typeof data === 'object' && data.message && typeof data.message === 'object') {
          let errorString = '';

          for (const key in data.message) {
            if (Array.isArray(data.message[key])) {
              errorString += data.message[key].join(' ') + ' ';
            }
          }

          throw new Error(errorString.trim());
        } else {
          console.log(data);
          throw new Error('An error occurred during signup.');
        }
      }
    } catch (err) {
      throw err;
    }
  },

  isAuthenticated() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return user && token;
  },

  getUser() {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  },

  getProfile: async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const token = localStorage.getItem('token');
      console.log('AuthService.getProfile - token from localStorage:', token);
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`${BASE_URL}user/profile`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.status === 200) {
        console.log(response.data.data);
        return response.data.data;
      } else {
        throw new Error('Failed to fetch profile data');
      }
    } catch (err) {
      throw err;
    }
  },
  uploadProfileImage: async (userId, imageData) => {
    try {
      if (!userId) {
        return 'Missing userId parameter';
      }

      const token = localStorage.getItem('token')
      if (!token) {
        return 'the server could not authenticate your request';
      }


      const response = await axios.post(`${BASE_URL}${authEndpoints.uploadProfileImage(userId)}`, imageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`

        },
      });

      if (response.data.success) {
        console.log(response.data.data);
        return response.data.message;
      } else {
        return response.data.message || 'Failed to upload profile image';
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return error.response.data.error || 'An error occurred';
    }
  },
  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return 'No token found in session storage';
      }

      await axios.post(`${BASE_URL}${authEndpoints.logout}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Remove the token from session storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // You can also perform any other necessary cleanup, such as clearing the user's data from the application state
    } catch (error) {
      console.error('Error logging out:', error);
      return error.response.data.error || 'An error occurred during logout';
    }
  },
  updateProfile: async (userId, profileData) => {
    try {
      if (!userId) {
        throw new Error('Missing userId parameter');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      profileData.user_id = userId

      console.log(userId);
      console.log(profileData.user_id)

      console.log(profileData)
      const response = await axios.put(`${BASE_URL}${authEndpoints.updateProfile(userId)}`, profileData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log(response)

      if (response.status === 200) {
        return response.data.message;
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.log(error)
      throw error;
    }
  },

  deleteAccount: async (userId) => {
      if (!userId) {
        throw new Error('Missing userId parameter');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      console.log(userId);

      const response = await axios.delete(`${BASE_URL}${authEndpoints.deleteAccount(userId)}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 200) {
        return response.data.message;
      } else {
        throw new Error('Failed to delete profile');
      }
  },

  updateUser: async (userId, userData) => { 
      if (!userId) {
        throw new Error('Missing userId parameter');
      }
  
      if (!userData) {
        throw new Error('Missing userData parameter');
      }
  
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }
  
      const response = await axios.put(`${BASE_URL}${authEndpoints.updateProfile(userId)}`, userData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (response.status === 200) {
        return response.data.data;
      } else {
        throw new Error('Failed to update user');
      }
  },

  // Token refresh method
  refreshToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${BASE_URL}${authEndpoints.refreshToken}`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Handle both token structures from backend
        const newToken = data.data.tokens?.access_token || data.data.token;
        console.log('Refreshed token:', newToken);

        if (newToken) {
          localStorage.setItem('token', newToken);
        }

        return {
          token: newToken,
          tokens: data.data.tokens // Include full tokens object
        };
      } else {
        throw new Error(data.message || 'Token refresh failed');
      }
    } catch (error) {
      // If refresh fails, clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },

  // Check if token is expired or about to expire
  isTokenExpired: () => {
    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      // Check if token expires in the next 5 minutes
      return payload.exp < (currentTime + 300);
    } catch (error) {
      return true;
    }
  },
};

export default AuthService;