import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
  deleteAccount: () => api.delete('/auth/account')
};

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`)
};

// Keywords API
export const keywordsAPI = {
  getByProject: (projectId) => api.get(`/keywords/project/${projectId}`),
  create: (data) => api.post('/keywords', data),
  bulkCreate: (data) => api.post('/keywords/bulk', data),
  update: (id, data) => api.put(`/keywords/${id}`, data),
  delete: (id) => api.delete(`/keywords/${id}`)
};

// SEO API
export const seoAPI = {
  comprehensiveResearch: (data) => api.post('/seo/research', data),
  relatedKeywords: (data) => api.post('/seo/related-keywords', data),
  keywordSuggestions: (data) => api.post('/seo/keyword-suggestions', data),
  keywordMetrics: (data) => api.post('/seo/keyword-metrics', data),
  domainKeywords: (data) => api.post('/seo/domain-keywords', data),
  serpData: (data) => api.post('/seo/serp-data', data)
};

export default api;
