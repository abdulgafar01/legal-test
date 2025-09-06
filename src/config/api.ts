// Central configuration for API endpoints and environment settings
// This file should be the single source of truth for all API configurations

interface ApiConfig {
  baseUrl: string;
  endpoints: {
    auth: {
      login: string;
      register: string;
      verifyEmail: string;
      resendVerification: string;
      completeProfile: string;
      practitionerCompleteProfile: string;
      tokenRefresh: string;
    };
    profile: {
      me: string;
      updateProfile: string;
    };
    licenses: string;
    certificates: string;
    practitioners: {
      list: string;
      detail: string;
      specializations: string;
    };
    explore: {
      categories: string;
      articles: string;
      featuredArticles: string;
      searchArticles: string;
    };
  };
}

// Environment-based configuration
const getApiBaseUrl = (): string => {
  // First, check if there's an environment variable set
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Fallback to environment-based logic
  if (process.env.NODE_ENV === 'development') {
    // For development, use the Next.js proxy instead of direct Django URL
    return ''; // Empty string means use relative URLs (goes through Next.js proxy)
  } else {
    // For production, use AWS EC2 instance
    return 'http://ec2-40-172-8-211.me-central-1.compute.amazonaws.com';
  }
};

export const API_CONFIG: ApiConfig = {
  baseUrl: getApiBaseUrl(),
  endpoints: {
    auth: {
      login: '/api/v1/auth/login/',
      register: '/api/v1/auth/register/',
      verifyEmail: '/api/v1/auth/verify_email/',
      resendVerification: '/api/v1/auth/resend_verification/',
      completeProfile: '/api/v1/auth/complete_profile/',
      practitionerCompleteProfile: '/api/v1/auth/practitioner_complete_profile/',
      tokenRefresh: '/api/v1/auth/token/refresh/',
    },
    profile: {
      me: '/api/v1/profile/me/',
      updateProfile: '/api/v1/profile/update_profile/',
    },
    licenses: '/api/v1/licenses/',
    certificates: '/api/v1/certificates/',
    practitioners: {
      list: '/api/v1/consultations/practitioners/',
      detail: '/api/v1/consultations/practitioners/',
      specializations: '/api/v1/practitioner-specializations/',
    },
    explore: {
      categories: '/api/v1/explore/categories/',
      articles: '/api/v1/explore/articles/',
      featuredArticles: '/api/v1/explore/articles/featured/',
      searchArticles: '/api/v1/explore/articles/search/',
    },
  },
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseUrl}${endpoint}`;
};

// Export commonly used URLs
export const API_BASE_URL = API_CONFIG.baseUrl;
export const API_ENDPOINTS = API_CONFIG.endpoints;

// Console log for debugging (remove in production)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:', {
    baseUrl: API_CONFIG.baseUrl,
    environment: process.env.NODE_ENV,
  });
}
