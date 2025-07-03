import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from "./config";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Service class using axios
class ApiService {
  constructor() {
    this.client = apiClient;
  }

  // Helper method to handle form data requests
  async requestFormData(endpoint, formData, config = {}) {
    try {
      const response = await this.client.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...config,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Helper method to handle URL encoded requests
  async requestUrlEncoded(endpoint, data, method = 'POST', config = {}) {
    try {
      const response = await this.client.request({
        method,
        url: endpoint,
        data: new URLSearchParams(data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        ...config,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText || 'Server error';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error - please check your connection');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }

  // Authentication methods
  async registerUser(userData) {
    return this.requestUrlEncoded(API_ENDPOINTS.AUTH.REGISTER_USER, userData);
  }

  async registerAdmin(adminData) {
    return this.requestUrlEncoded(API_ENDPOINTS.AUTH.REGISTER_ADMIN, adminData);
  }

  async loginUser(credentials) {
    return this.requestUrlEncoded(API_ENDPOINTS.AUTH.LOGIN_USER, credentials);
  }

  async loginAdmin(credentials) {
    return this.requestUrlEncoded(API_ENDPOINTS.AUTH.LOGIN_ADMIN, credentials);
  }

  async forgotPassword(email) {
    return this.requestUrlEncoded(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  async verifyResetCode(email, code) {
    return this.requestUrlEncoded(API_ENDPOINTS.AUTH.VERIFY_RESET_CODE, { email, code });
  }

  async resetPassword(email, code, newPassword) {
    return this.requestUrlEncoded(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      email,
      code,
      newPassword
    });
  }

  // User profile methods
  async getProfile() {
    try {
      const response = await this.client.get(API_ENDPOINTS.USER.PROFILE);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAdminProfile() {
    try {
      const response = await this.client.get(API_ENDPOINTS.USER.ADMIN_PROFILE);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Major methods
  async createMajor(majorData) {
    return this.requestUrlEncoded(API_ENDPOINTS.MAJOR.CREATE, majorData);
  }

  async getAllMajors() {
    try {
      const response = await this.client.get(API_ENDPOINTS.MAJOR.GET_ALL);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMajorById(id) {
    try {
      const response = await this.client.get(`${API_ENDPOINTS.MAJOR.GET_BY_ID}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Level methods
  async createLevel(levelData) {
    return this.requestUrlEncoded(API_ENDPOINTS.LEVEL.CREATE, levelData);
  }

  async getAllLevels() {
    try {
      const response = await this.client.get(API_ENDPOINTS.LEVEL.GET_ALL);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getLevelById(id) {
    try {
      const response = await this.client.get(`${API_ENDPOINTS.LEVEL.GET_BY_ID}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Sub Major methods
  async createSubMajor(subMajorData) {
    return this.requestUrlEncoded(API_ENDPOINTS.SUB_MAJOR.CREATE, subMajorData);
  }

  async getAllSubMajors() {
    try {
      const response = await this.client.get(API_ENDPOINTS.SUB_MAJOR.GET_ALL);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSubMajorById(id) {
    try {
      const response = await this.client.get(`${API_ENDPOINTS.SUB_MAJOR.GET_BY_ID}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Course methods
  async createCourse(courseData) {
    return this.requestUrlEncoded(API_ENDPOINTS.COURSE.CREATE, courseData);
  }

  async getAllCourses() {
    try {
      const response = await this.client.get(API_ENDPOINTS.COURSE.GET_ALL);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCourseById(id) {
    try {
      const response = await this.client.get(`${API_ENDPOINTS.COURSE.GET_BY_ID}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Event methods
  async createEvent(eventData) {
    return this.requestFormData(API_ENDPOINTS.EVENT.CREATE, eventData);
  }

  async getAllEvents(queryParams = {}) {
    try {
      const params = new URLSearchParams(queryParams);
      const response = await this.client.get(`${API_ENDPOINTS.EVENT.GET_ALL}?${params}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getEventById(id) {
    try {
      const response = await this.client.get(`${API_ENDPOINTS.EVENT.GET_BY_ID}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteEvent(id) {
    try {
      const response = await this.client.delete(`${API_ENDPOINTS.EVENT.DELETE}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Lecture Time methods
  async createLectureTime(lectureData) {
    return this.requestUrlEncoded(API_ENDPOINTS.LECTURE_TIME.CREATE, lectureData);
  }

  async getAllLectureTimes() {
    try {
      const response = await this.client.get(API_ENDPOINTS.LECTURE_TIME.GET_ALL);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getLectureTimeById(id) {
    try {
      const response = await this.client.get(`${API_ENDPOINTS.LECTURE_TIME.GET_BY_ID}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateLectureTime(id, lectureData) {
    return this.requestUrlEncoded(`${API_ENDPOINTS.LECTURE_TIME.UPDATE}/${id}`, lectureData, 'PUT');
  }

  async deleteLectureTime(id) {
    try {
      const response = await this.client.delete(`${API_ENDPOINTS.LECTURE_TIME.DELETE}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 