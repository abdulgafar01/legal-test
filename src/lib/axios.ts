// @/lib/axios.ts
import axios from 'axios';
import { API_CONFIG, buildApiUrl } from '@/config/api';

const instance = axios.create({
  baseURL: API_CONFIG.baseUrl,
  withCredentials: true,
});

// Request interceptor to add token to headers
instance.interceptors.request.use((config) => {
  // List of endpoints that should NOT include auth headers (public endpoints)
  const publicEndpoints = [
    '/api/v1/phone-auth/request_otp',
    '/api/v1/phone-auth/verify_otp',
    '/api/v1/phone-auth/resend_otp',
    '/api/v1/phone-auth/check_phone',
    '/api/v1/auth/register',
    '/api/v1/auth/login',
    '/api/v1/auth/verify-email',
    '/api/v1/auth/resend-verification',
  ];

  // Check if the request URL matches any public endpoint
  const isPublicEndpoint = publicEndpoints.some(endpoint => 
    config.url?.includes(endpoint)
  );

  // Only add token if it's not a public endpoint
  if (!isPublicEndpoint) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
});

// Response interceptor to handle token refresh
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Suppress console errors for expected 404 on phone-auth endpoints (user not found during login)
    if (error.response?.status === 404 && originalRequest.url?.includes('phone-auth')) {
      // This is an expected error (user not registered), don't log to console
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Use the centralized configuration for token refresh URL
        const response = await axios.post(
          buildApiUrl(API_CONFIG.endpoints.auth.tokenRefresh),
          { refresh: refreshToken }
        );

        const { access } = response.data;
        localStorage.setItem('accessToken', access);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return instance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userEmail');
        
        // Dispatch a custom event for auth state change
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:logout'));
          
          // Only redirect if we're not already on the login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
