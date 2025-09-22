# 🔧 Centralized API Configuration

This document describes the centralized API configuration system implemented for the legal-dashboard project.

## 📁 Files Created/Modified

### New Files:
- `src/config/api.ts` - Central API configuration
- `.env.example` - Environment variables template
- `.env.local` - Local development environment variables

### Modified Files:
- `src/lib/axios.ts` - Updated to use centralized config
- `src/lib/api/auth.ts` - Updated all endpoints to use centralized config
- `src/lib/api/user.ts` - Updated endpoints
- `next.config.ts` - Updated to use the same base URL logic
- `src/components/ApiTestComponent.tsx` - Enhanced debugging

## 🎯 Problem Solved

**Before:** Multiple hardcoded API URLs throughout the project:
- `next.config.ts`: `http://localhost:8000`
- `axios.ts`: `http://ec2-40-172-8-211.me-central-1.compute.amazonaws.com`
- Various API files: `/api/v1` or `/v1`

**After:** Single source of truth for all API configurations.

## 🏗️ How It Works

### 1. Central Configuration (`src/config/api.ts`)
```typescript
// Automatically chooses the right URL based on environment
const getApiBaseUrl = (): string => {
  // 1. Check environment variable (highest priority)
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // 2. Fallback to environment-based logic
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000';  // Development
  } else {
    return 'http://ec2-40-172-8-211.me-central-1.compute.amazonaws.com';  // Production
  }
};
```

### 2. Environment Variables
```bash
# .env.local (for development)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NODE_ENV=development

# .env.production (for production)
NEXT_PUBLIC_API_BASE_URL=http://ec2-40-172-8-211.me-central-1.compute.amazonaws.com
NODE_ENV=production
```

### 3. Usage Throughout Project
```typescript
import { API_ENDPOINTS, buildApiUrl } from '@/config/api';

// Instead of: axios.get('/api/v1/profile/me/')
// Use: axios.get(API_ENDPOINTS.profile.me)
```

## 🔄 Environment Switching

### Development Mode
- **Frontend**: `http://localhost:3000`
- **API Proxy**: `/api/*` → `http://localhost:8000/api/*`
- **Direct API**: `http://localhost:8000`

### Production Mode
- **Frontend**: Your production domain
- **API Proxy**: `/api/*` → `http://ec2-40-172-8-211.me-central-1.compute.amazonaws.com/api/*`
- **Direct API**: `http://ec2-40-172-8-211.me-central-1.compute.amazonaws.com`

## 🛠️ Configuration Options

### Option 1: Environment Variables (Recommended)
Set `NEXT_PUBLIC_API_BASE_URL` in your environment:
```bash
# Development
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Production
NEXT_PUBLIC_API_BASE_URL=http://ec2-40-172-8-211.me-central-1.compute.amazonaws.com

# Custom (for testing)
NEXT_PUBLIC_API_BASE_URL=http://your-custom-api-server.com
```

### Option 2: Automatic Detection
If no environment variable is set, it automatically detects:
- `development` → `http://localhost:8000`
- `production` → `http://ec2-40-172-8-211.me-central-1.compute.amazonaws.com`

## 📊 Available Endpoints

All endpoints are centrally defined in `src/config/api.ts`:

```typescript
export const API_ENDPOINTS = {
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
};
```

## 🧪 Testing & Debugging

### Debug Tools Added:
1. **Console Logging**: Check browser console for API configuration info
2. **API Test Component**: Yellow debug box on dashboard to test direct API calls
3. **Enhanced Error Messages**: Better error reporting in API calls

### Common Issues & Solutions:

#### Issue: "Cannot connect to API"
**Solution**: Check if the backend server is running on the configured URL

#### Issue: "Wrong user data showing"
**Solution**: 
1. Clear React Query cache (refresh button in sidebar)
2. Check localStorage for correct email
3. Verify API is returning correct data using debug tools

#### Issue: "CORS errors"
**Solution**: Ensure backend CORS settings allow the frontend domain

## 🚀 Deployment Considerations

### Development Deployment
1. Ensure Django server is running on `http://localhost:8000`
2. Frontend will automatically proxy API calls

### Production Deployment
1. Set `NEXT_PUBLIC_API_BASE_URL=http://ec2-40-172-8-211.me-central-1.compute.amazonaws.com`
2. Or rely on automatic production detection
3. Ensure AWS EC2 instance is accessible from your frontend domain

## 📝 Best Practices

1. **Always use `API_ENDPOINTS`** instead of hardcoded URLs
2. **Use `buildApiUrl()`** for complex URL construction
3. **Test configuration changes** using the debug tools
4. **Keep environment files secure** (never commit `.env.local`)
5. **Update `.env.example`** when adding new environment variables

## 🔍 Troubleshooting Commands

```bash
# Check current configuration
console.log(API_CONFIG.baseUrl);

# Test API connection
await getCurrentUser();

# Clear React Query cache
queryClient.clear();

# Check environment variables
console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
```

## 📋 Migration Checklist

- [x] Created central configuration file
- [x] Updated axios instance to use central config
- [x] Updated all API functions to use central endpoints
- [x] Updated next.config.ts to use same logic
- [x] Created environment variable templates
- [x] Added debugging tools
- [x] Verified no hardcoded URLs remain

---

**Result**: Now the entire project uses a single, centralized API configuration that automatically adapts to different environments! 🎉
