import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for API requests - use environment variable if available
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token in headers
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    console.log('API Request to:', config.url);
    console.log('Token available:', token ? 'YES' : 'NO');
    console.log('API URL:', API_URL);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response status:', response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const conversationApi = {
  getAll: () => api.get('/conversations'),
  getById: (id) => api.get(`/conversations/${id}`),
  create: (data) => api.post('/conversations', data),
  update: (id, data) => api.put(`/conversations/${id}`, data),
  delete: (id) => api.delete(`/conversations/${id}`),
  addMessage: (id, data) => api.post(`/conversations/${id}/messages`, data),
};

export const relationshipApi = {
  getAll: () => api.get('/relationships'),
  getById: (id) => api.get(`/relationships/${id}`),
  create: (data) => api.post('/relationships', data),
  update: (id, data) => api.put(`/relationships/${id}`, data),
  delete: (id) => api.delete(`/relationships/${id}`),
};

export const toneApi = {
  getAll: () => api.get('/tones'),
  create: (data) => api.post('/tones', data),
  update: (id, data) => api.put(`/tones/${id}`, data),
  delete: (id) => api.delete(`/tones/${id}`),
  getPreferred: () => api.get('/tones/preferred'),
  updatePreferred: (data) => api.put('/tones/preferred', data),
};

export const responseApi = {
  generate: (data) => api.post('/responses/generate', data),
  generateMultiple: (data) => api.post('/responses/generate-multiple', data),
  generateAndSave: (data) => api.post('/responses/generate-and-save', data),
};

export default api;