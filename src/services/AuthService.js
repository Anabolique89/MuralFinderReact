import axios from "axios";
import { BASE_URL, authEndpoints } from "../constants/ApiEndpoints";

const AuthService = {
  login: async (email, password) => {
    try {
      const inputObj = { email, password };
      console.log("AuthService.login called with:", inputObj);
      console.log("API URL:", `${BASE_URL}${authEndpoints.login}`);

      const response = await fetch(`${BASE_URL}${authEndpoints.login}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(inputObj),
      });

      console.log("Login response status:", response.status);

      // Check if response is empty
      if (response.status === 204 || response.status === 205) {
        throw new Error(
          "Server returned empty response. Please contact support."
        );
      }

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned invalid response format.");
      }

      const data = await response.json();
      console.log("Login response data:", data);

      if (response.ok) {
        const dataObj = data.data;

        if (!dataObj || !dataObj.user) {
          throw new Error("Invalid response from server");
        }

        const token = dataObj.tokens?.access_token || dataObj.token;

        if (!token) {
          throw new Error("No authentication token received");
        }

        // Store authentication data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(dataObj.user));

        if (dataObj.tokens?.refresh_token) {
          localStorage.setItem("refresh_token", dataObj.tokens.refresh_token);
        }

        return {
          user: dataObj.user,
          token: token,
          tokens: dataObj.tokens,
        };
      } else {
        // Handle specific error responses
        if (response.status === 401) {
          throw new Error("Invalid email or password. Please try again.");
        } else if (response.status === 403) {
          throw new Error(
            "Your account has been suspended. Please contact support."
          );
        } else if (response.status === 422) {
          // Handle validation errors
          if (data.errors) {
            const errorMessages = Object.values(data.errors).flat();
            throw new Error(errorMessages.join(" "));
          }
          throw new Error(data.message || "Invalid credentials");
        } else {
          throw new Error(data.message || "Login failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("AuthService.login error:", err);

      if (err instanceof TypeError && err.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to server. Please check your internet connection."
        );
      }

      if (
        err.message.includes("CORS") ||
        err.message.includes("NetworkError")
      ) {
        throw new Error("Server connection error. Please try again later.");
      }

      throw err;
    }
  },

  signup: async (username, email, role, password, passwordConfirmation) => {
    try {
      const inputObj = {
        username,
        email,
        role,
        password,
        password_confirmation: passwordConfirmation,
      };

      const response = await fetch(`${BASE_URL}${authEndpoints.register}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(inputObj),
      });

      // Check for empty responses
      if (response.status === 204 || response.status === 205) {
        throw new Error("Server returned empty response");
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned invalid response format");
      }

      const data = await response.json();

      if (response.ok) {
        return {
          message:
            data.message ||
            "Registration successful! Please check your email to verify your account.",
          success: true,
        };
      } else {
        // Handle validation errors (422)
        if (response.status === 422) {
          if (data.errors && typeof data.errors === "object") {
            // Format Laravel validation errors
            const errorMessages = [];

            for (const [field, messages] of Object.entries(data.errors)) {
              if (Array.isArray(messages)) {
                // Make error messages more user-friendly
                messages.forEach((msg) => {
                  if (msg.includes("already been taken")) {
                    if (field === "username") {
                      errorMessages.push(
                        "This username is already registered. Please choose another one."
                      );
                    } else if (field === "email") {
                      errorMessages.push(
                        "This email address is already registered. Try logging in instead."
                      );
                    } else {
                      errorMessages.push(msg);
                    }
                  } else if (msg.includes("required")) {
                    errorMessages.push(
                      `${
                        field.charAt(0).toUpperCase() + field.slice(1)
                      } is required.`
                    );
                  } else if (msg.includes("invalid")) {
                    errorMessages.push(`Please enter a valid ${field}.`);
                  } else {
                    errorMessages.push(msg);
                  }
                });
              }
            }

            throw new Error(errorMessages.join(" "));
          } else if (data.message) {
            throw new Error(data.message);
          }
        }

        // Handle old format validation errors
        if (
          data &&
          typeof data === "object" &&
          data.message &&
          typeof data.message === "object"
        ) {
          let errorString = "";
          for (const key in data.message) {
            if (Array.isArray(data.message[key])) {
              errorString += data.message[key].join(" ") + " ";
            }
          }
          throw new Error(errorString.trim());
        }

        throw new Error(
          data.message || "Registration failed. Please try again."
        );
      }
    } catch (err) {
      console.error("AuthService.signup error:", err);

      if (err instanceof TypeError && err.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to server. Please check your internet connection."
        );
      }

      if (
        err.message.includes("CORS") ||
        err.message.includes("NetworkError")
      ) {
        throw new Error("Server connection error. Please try again later.");
      }

      throw err;
    }
  },

  isAuthenticated() {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!user || !token) {
      return false;
    }

    if (this.isTokenExpired()) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      return false;
    }

    return true;
  },

  getUser() {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  },

  getProfile: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await axios.get(`${BASE_URL}user/profile`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch profile data");
      }
    } catch (err) {
      console.error("AuthService.getProfile error:", err);
      throw err;
    }
  },

  uploadProfileImage: async (userId, imageData) => {
    try {
      if (!userId) {
        throw new Error("Missing userId parameter");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await axios.post(
        `${BASE_URL}${authEndpoints.uploadProfileImage}`,
        imageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        return response.data.message;
      } else {
        throw new Error(
          response.data.message || "Failed to upload profile image"
        );
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw new Error(
        error.response?.data?.error || error.message || "An error occurred"
      );
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      await axios.post(`${BASE_URL}${authEndpoints.logout}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error logging out:", error);

      // Clear tokens even if request fails
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      throw new Error(
        error.response?.data?.error || error.message || "Logout failed"
      );
    }
  },

  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await axios.put(
        `${BASE_URL}${authEndpoints.updateProfile}`,
        profileData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("AuthService.updateProfile error:", error);
      throw error;
    }
  },

  deleteAccount: async (userId) => {
    if (!userId) {
      throw new Error("Missing userId parameter");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await axios.delete(
      `${BASE_URL}${authEndpoints.deleteAccount(userId)}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.message;
    } else {
      throw new Error("Failed to delete account");
    }
  },

  updateUser: async (userId, userData) => {
    if (!userId) {
      throw new Error("Missing userId parameter");
    }

    if (!userData) {
      throw new Error("Missing userData parameter");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await axios.put(
      `${BASE_URL}${authEndpoints.updateProfile(userId)}`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to update user");
    }
  },

  refreshToken: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${BASE_URL}${authEndpoints.refreshToken}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        const newToken = data.data.tokens?.access_token || data.data.token;

        if (newToken) {
          localStorage.setItem("token", newToken);

          if (data.data.tokens?.refresh_token) {
            localStorage.setItem(
              "refresh_token",
              data.data.tokens.refresh_token
            );
          }
        }

        return {
          token: newToken,
          tokens: data.data.tokens,
        };
      } else {
        throw new Error(data.message || "Token refresh failed");
      }
    } catch (error) {
      console.error("Token refresh error:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      throw error;
    }
  },

  isTokenExpired: () => {
    const token = localStorage.getItem("token");
    if (!token) return true;

    try {
      // Laravel Sanctum tokens are plain text
      // Backend handles expiration validation
      return false;
    } catch (error) {
      return true;
    }
  },
};

export default AuthService;
