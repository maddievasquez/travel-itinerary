import axios from 'axios';
import Cookie from "../components/cookies";

const API_URL = 'http://127.0.0.1:8000/api';

// Create a reusable axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true
});

// Request interceptor for auth tokens
api.interceptors.request.use(config => {
  const token = Cookie.getCookie('access');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Response interceptor with token refresh logic
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = Cookie.getCookie('refresh');
        if (!refreshToken) throw new Error('No refresh token');
        
        const response = await axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken });
        const newAccessToken = response.data.access;
        
        // Update tokens
        Cookie.setCookie('access', newAccessToken, 1);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout completely
        Cookie.deleteCookie('access');
        Cookie.deleteCookie('refresh');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const fetchProfile = async () => {
  try {
    const response = await api.get(`${API_URL}/user/profile/`);
    return response.data;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const { first_name, last_name, email, location } = profileData;
    const response = await api.patch(`${API_URL}/user/profile/update/`, { 
      first_name, last_name, email, location 
    });
    return response.data;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

export const fetchSettings = async () => {
  try {
    const response = await api.get(`${API_URL}/user/settings/`);
    return response.data;
  } catch (error) {
    console.error('Settings fetch error:', error);
    throw error;
  }
};

export const updateSettings = async (settingsData) => {
  try {
    const response = await api.post(`${API_URL}/user/settings/update/`, settingsData);
    return response.data;
  } catch (error) {
    console.error('Settings update error:', error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post(`${API_URL}/user/login/`, credentials);
    if (response.data.access) {
      Cookie.setCookie('access', response.data.access, 1);
      if (response.data.refresh) {
        Cookie.setCookie('refresh', response.data.refresh, 7);
      }
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post(`${API_URL}/user/logout/`);
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    Cookie.deleteCookie('access');
    Cookie.deleteCookie('refresh');
    window.location.href = '/login';
  }
};

export const signup = async (userData) => {
  try {
    const response = await api.post(`${API_URL}/user/signup/`, userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const fetchUserItineraries = async () => {
  try {
    const response = await api.get(`${API_URL}/user/itineraries/`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user itineraries:', error);
    throw error;
  }
};

export const checkAuthStatus = () => {
  return !!Cookie.getCookie('access');
};

export default {
  fetchProfile,
  updateProfile,
  fetchSettings,
  updateSettings,
  login,
  logout,
  signup,
  fetchUserItineraries,
  checkAuthStatus
};