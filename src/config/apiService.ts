import axios from 'axios';
import { API_CONFIG } from './api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.tokenRefresh}`, {
            refresh: refreshToken
          });
          
          const newToken = response.data.access;
          localStorage.setItem('accessToken', newToken);
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export const ApiService = {
  // Profile Management
  async getPractitionerProfile() {
    const response = await apiClient.get('/api/v1/profile/me/');
    return response;
  },

  async updatePractitionerProfile(data: any) {
    const response = await apiClient.patch('/api/v1/profile/update_practitioner_profile/', data);
    return response;
  },

  // Availability Management
  async getAvailability() {
    const response = await apiClient.get('/api/v1/availability/');
    return response;
  },

  async updateAvailability(data: any) {
    const response = await apiClient.post('/api/v1/availability/', data);
    return response;
  },

  async deleteAvailability(id: number) {
    const response = await apiClient.delete(`/api/v1/availability/${id}/`);
    return response;
  },

  // Recurring Availability
  async getRecurringAvailability() {
    const response = await apiClient.get('/api/v1/recurring-availability/');
    return response;
  },

  async updateRecurringAvailability(data: any) {
    const response = await apiClient.post('/api/v1/recurring-availability/', data);
    return response;
  },

  async deleteRecurringAvailability(id: number) {
    const response = await apiClient.delete(`/api/v1/recurring-availability/${id}/`);
    return response;
  },

  // Specializations
  async getSpecializations() {
    const response = await apiClient.get('/api/v1/practitioner-specializations/');
    return response;
  },

  // Wallet Management
  async getWallet() {
    return apiClient.get('/api/v1/consultations/wallet/');
  },

  async getWalletTransactions(params?: { page?: number; type?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.type) query.append('type', params.type);
    const qs = query.toString();
    return apiClient.get(`/api/v1/consultations/wallet/transactions/${qs ? `?${qs}` : ''}`);
  },

  async requestWithdrawal() {
    return apiClient.post('/api/v1/consultations/wallet/request_withdraw/');
  },
};
