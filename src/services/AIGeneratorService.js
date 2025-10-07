import axios from "axios";

class AIGeneratorService {
  constructor() {
    this.baseURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
  }

  /**
   * Get auth headers - Laravel Sanctum tokens can't be validated on frontend
   */
  async getAuthHeaders() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.redirectToLogin();
      throw new Error("No authentication token found. Please login again.");
    }

    // For Laravel Sanctum tokens, we can't validate expiration on frontend
    // The backend will handle expiration validation and return 401 if expired
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Clear tokens and redirect to login page
   */
  redirectToLogin() {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    // Redirect to login page
    window.location.href = "/login";
  }

  /**
   * Generate themed image using archetype without reference image
   * @param {string} archetype - The archetype to generate (viking, royal, norse)
   * @returns {Promise<Object>} Response with generated image URL
   */
  async generateArchetype(archetype) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.post(
        `${this.baseURL}/ai-generator/generate-archetype`,
        {
          archetype,
        },
        {
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error generating archetype:", error);

      // If it's an authentication error, redirect to login
      if (error.response?.status === 401) {
        this.redirectToLogin();
        return {
          success: false,
          error: "Session expired. Redirecting to login...",
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Generate themed image using archetype with reference image
   * @param {string} archetype - The archetype to generate (viking, royal, norse)
   * @param {File} imageFile - The reference image file
   * @returns {Promise<Object>} Response with generated image URL
   */
  async forgeSaga(archetype, imageFile) {
    try {
      const headers = await this.getAuthHeaders();
      const formData = new FormData();
      formData.append("archetype", archetype);
      formData.append("image", imageFile);

      const response = await axios.post(
        `${this.baseURL}/ai-generator/forge-saga`,
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error forging saga:", error);

      // If it's an authentication error, redirect to login
      if (error.response?.status === 401) {
        this.redirectToLogin();
        return {
          success: false,
          error: "Session expired. Redirecting to login...",
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Generate themed image using custom prompt without reference image
   * @param {string} customPrompt - The custom prompt to generate
   * @returns {Promise<Object>} Response with generated image URL
   */
  async generateCustomPrompt(customPrompt) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.post(
        `${this.baseURL}/ai-generator/generate-custom`,
        {
          prompt: customPrompt,
        },
        {
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error generating custom prompt:", error);

      // If it's an authentication error, redirect to login
      if (error.response?.status === 401) {
        this.redirectToLogin();
        return {
          success: false,
          error: "Session expired. Redirecting to login...",
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Generate themed image using custom prompt with reference image
   * @param {string} customPrompt - The custom prompt to generate
   * @param {File} imageFile - The reference image file
   * @returns {Promise<Object>} Response with generated image URL
   */
  async forgeCustomSaga(customPrompt, imageFile) {
    try {
      const headers = await this.getAuthHeaders();
      const formData = new FormData();
      formData.append("prompt", customPrompt);
      formData.append("image", imageFile);

      const response = await axios.post(
        `${this.baseURL}/ai-generator/forge-custom-saga`,
        formData,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error forging custom saga:", error);

      // If it's an authentication error, redirect to login
      if (error.response?.status === 401) {
        this.redirectToLogin();
        return {
          success: false,
          error: "Session expired. Redirecting to login...",
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Check prediction status and progress
   * @param {string} predictionId - The prediction ID to check
   * @returns {Promise<Object>} Response with status and progress
   */
  async checkPredictionStatus(predictionId) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.post(
        `${this.baseURL}/ai-generator/check-status`,
        {
          prediction_id: predictionId,
        },
        {
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error checking prediction status:", error);

      // If it's an authentication error, redirect to login
      if (error.response?.status === 401) {
        this.redirectToLogin();
        return {
          success: false,
          error: "Session expired. Redirecting to login...",
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Download generated image
   * @param {string} imageUrl - URL of the generated image
   * @param {string} filename - Desired filename for download
   * @returns {Promise<boolean>} Success status
   */
  async downloadImage(imageUrl, filename) {
    try {
      const response = await axios.get(imageUrl, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Error downloading image:", error);
      return false;
    }
  }

  /**
   * Upload generated image as artwork
   * @param {string} imageUrl - URL of the generated image
   * @param {string} archetype - The archetype used (or 'custom' for custom prompts)
   * @param {string} title - Optional custom title
   * @param {string} description - Optional custom description
   * @param {string|null} customPrompt - Optional custom prompt used
   * @returns {Promise<Object>} Response with artwork data
   */
  async uploadAsArtwork(
    imageUrl,
    archetype,
    title = null,
    description = null,
    customPrompt = null
  ) {
    try {
      const headers = await this.getAuthHeaders();
      const payload = {
        image_url: imageUrl,
        archetype: archetype,
        title: title,
        description: description,
      };

      // Add custom prompt if provided
      if (customPrompt) {
        payload.prompt = customPrompt;
      }

      const response = await axios.post(
        `${this.baseURL}/ai-generator/upload-as-artwork`,
        payload,
        {
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error uploading as artwork:", error);

      // If it's an authentication error, redirect to login
      if (error.response?.status === 401) {
        this.redirectToLogin();
        return {
          success: false,
          error: "Session expired. Redirecting to login...",
        };
      }

      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Get available archetypes from Laravel API
   * @returns {Promise<Array>} List of available archetypes
   */
  async getAvailableArchetypes() {
    try {
      const response = await axios.get(
        `${this.baseURL}/v1/ai-generator/archetypes`
      );
      return response.data.data.archetypes;
    } catch (error) {
      console.error("Error fetching archetypes:", error);
      // Fallback to hardcoded archetypes
      return [
        {
          value: "street-art",
          label: "🎨 Street Art",
          description:
            "Bold urban street art with vibrant colors and graffiti elements",
          icon: "🏙️",
          prompt:
            "street art mural, vibrant graffiti style, bold colors, urban art, spray paint effect, wall art",
        },
        {
          value: "abstract",
          label: "🌀 Abstract",
          description:
            "Contemporary abstract art with geometric shapes and flowing forms",
          icon: "🎭",
          prompt:
            "abstract mural art, geometric shapes, flowing forms, contemporary style, colorful, modern art",
        },
        {
          value: "realistic",
          label: "📷 Photorealistic",
          description: "Highly detailed photorealistic mural art",
          icon: "🖼️",
          prompt:
            "photorealistic mural, highly detailed, realistic painting, wall art, fine details, professional quality",
        },
        {
          value: "pop-art",
          label: "💥 Pop Art",
          description:
            "Vibrant pop art style with bold colors and comic book aesthetics",
          icon: "🎪",
          prompt:
            "pop art mural, bold colors, comic book style, vibrant, retro pop art aesthetic, graphic design",
        },
        {
          value: "surreal",
          label: "🌙 Surrealism",
          description: "Dreamlike surrealist art with imaginative elements",
          icon: "✨",
          prompt:
            "surrealist mural art, dreamlike, imaginative, fantasy elements, surreal composition, artistic",
        },
        {
          value: "geometric",
          label: "🔷 Geometric",
          description: "Clean geometric patterns and shapes in modern style",
          icon: "📐",
          prompt:
            "geometric mural, clean patterns, modern design, architectural, symmetrical, minimalist style",
        },
        {
          value: "nature",
          label: "🌿 Nature/Botanical",
          description: "Beautiful natural elements, flora and fauna",
          icon: "🌺",
          prompt:
            "nature mural, botanical art, flora and fauna, natural elements, organic, garden wall art",
        },
        {
          value: "portrait",
          label: "👤 Portrait",
          description: "Artistic portrait style for faces and figures",
          icon: "🎨",
          prompt:
            "portrait mural art, artistic face, figure painting, expressive, wall portrait, contemporary style",
        },
      ];
    }
  }

  /**
   * Get user's generation limit info
   * @returns {Promise<Object>} Generation limit info
   */
  async getGenerationLimit() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(
        `${this.baseURL}/ai-generator/generation-limit`,
        {
          headers,
        }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error fetching generation limit:", error);

      if (error.response?.status === 401) {
        this.redirectToLogin();
      }

      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Get user generation statistics (remaining generations, subscription status)
   * @returns {Promise<Object>} User stats
   */
  async getUserGenerationStats() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(
        `${this.baseURL}/ai-generator/user-stats`,
        {
          headers,
        }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);

      if (error.response?.status === 401) {
        this.redirectToLogin();
      }

      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Get user's generation history
   * @returns {Promise<Object>} Generation history
   */
  async getGenerationHistory() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(`${this.baseURL}/ai-generator/history`, {
        headers,
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error fetching generation history:", error);

      if (error.response?.status === 401) {
        this.redirectToLogin();
      }

      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }
  /**
   * Validate image file
   * @param {File} file - Image file to validate
   * @returns {Object} Validation result
   */
  validateImageFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!file) {
      return { valid: true }; // No file is allowed (optional)
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Please select a valid image file (JPEG, PNG, or WebP)",
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: "Image file size must be less than 10MB",
      };
    }

    return { valid: true };
  }
}

export default new AIGeneratorService();
