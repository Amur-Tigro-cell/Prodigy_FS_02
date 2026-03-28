import axios from 'axios';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants/constants';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  register: (userData) => api.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  refreshToken: () => api.post(API_ENDPOINTS.AUTH.REFRESH),
};

// Employees API
export const employeesAPI = {
  getAll: (params) => api.get(API_ENDPOINTS.EMPLOYEES.GET_ALL, { params }),
  getById: (id) => api.get(API_ENDPOINTS.EMPLOYEES.GET_BY_ID.replace(':id', id)),
  create: (data) => api.post(API_ENDPOINTS.EMPLOYEES.CREATE, data),
  update: (id, data) => api.put(API_ENDPOINTS.EMPLOYEES.UPDATE.replace(':id', id), data),
  delete: (id) => api.delete(API_ENDPOINTS.EMPLOYEES.DELETE.replace(':id', id)),
};

// Tasks API
export const tasksAPI = {
  getAll: (params) => api.get(API_ENDPOINTS.TASKS.GET_ALL, { params }),
  getById: (id) => api.get(API_ENDPOINTS.TASKS.GET_BY_ID.replace(':id', id)),
  create: (data) => api.post(API_ENDPOINTS.TASKS.CREATE, data),
  update: (id, data) => api.put(API_ENDPOINTS.TASKS.UPDATE.replace(':id', id), data),
  delete: (id) => api.delete(API_ENDPOINTS.TASKS.DELETE.replace(':id', id)),
};

// Projects API
export const projectsAPI = {
  getAll: (params) => api.get(API_ENDPOINTS.PROJECTS.GET_ALL, { params }),
  getById: (id) => api.get(API_ENDPOINTS.PROJECTS.GET_BY_ID.replace(':id', id)),
  create: (data) => api.post(API_ENDPOINTS.PROJECTS.CREATE, data),
  update: (id, data) => api.put(API_ENDPOINTS.PROJECTS.UPDATE.replace(':id', id), data),
  delete: (id) => api.delete(API_ENDPOINTS.PROJECTS.DELETE.replace(':id', id)),
};

// Attendance API
export const attendanceAPI = {
  checkIn: (data) => api.post(API_ENDPOINTS.ATTENDANCE.CHECK_IN, data),
  checkOut: (data) => api.post(API_ENDPOINTS.ATTENDANCE.CHECK_OUT, data),
  getRecords: (params) => api.get(API_ENDPOINTS.ATTENDANCE.GET_RECORDS, { params }),
};

// Clients API
export const clientsAPI = {
  getAll: (params) => api.get(API_ENDPOINTS.CLIENTS.GET_ALL, { params }),
  getById: (id) => api.get(API_ENDPOINTS.CLIENTS.GET_BY_ID.replace(':id', id)),
  create: (data) => api.post(API_ENDPOINTS.CLIENTS.CREATE, data),
  update: (id, data) => api.put(API_ENDPOINTS.CLIENTS.UPDATE.replace(':id', id), data),
  delete: (id) => api.delete(API_ENDPOINTS.CLIENTS.DELETE.replace(':id', id)),
};

export default api;
