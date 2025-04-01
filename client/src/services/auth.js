import axios from 'axios';
import Cookie from "../components/cookies";

const API_URL = 'http://127.0.0.1:8000/api';

// Configure axios with default headers
axios.interceptors.request.use(
  config => {
    const token = Cookie.getCookie('access');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Handle authentication errors globally
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized, redirecting to login');
      Cookie.logoutClickHandler();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const fetchProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/profile/`);
    return response.data;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    // Extract only the allowed fields
    const { first_name, last_name, email, location } = profileData;
    const dataToSend = { first_name, last_name, email, location };
    
    // Try PATCH first, fall back to PUT if needed
    const response = await axios({
      method: 'patch', // or 'put' depending on your API
      url: `${API_URL}/user/profile/update/`, // Note the /update/ endpoint
      data: dataToSend
    });
    
    return response.data;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

export const fetchSettings = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/settings/`);
    return response.data;
  } catch (error) {
    console.error('Settings fetch error:', error);
    throw error;
  }
};

export const updateSettings = async (settingsData) => {
  try {
    const response = await axios.post(`${API_URL}/user/settings/update/`, settingsData);
    return response.data;
  } catch (error) {
    console.error('Settings update error:', error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/user/login/`, credentials);
    if (response.data.access) {
      Cookie.setCookie('access', response.data.access);
      if (response.data.refresh) {
        Cookie.setCookie('refresh', response.data.refresh);
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
    await axios.post(`${API_URL}/user/logout/`);
    Cookie.logoutClickHandler();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    Cookie.logoutClickHandler();
    throw error;
  }
};

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/user/signup/`, userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const fetchUserItineraries = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/itineraries/`);
    return response.data;
  } catch (error) {
    console.error('User itineraries fetch error:', error);
    throw error;
  }
};

export const checkAuthStatus = () => {
  const token = Cookie.getCookie('access');
  return !!token;
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