import type { NextConfig } from "next";

// Central API configuration - should match src/config/api.ts logic
const getApiBaseUrl = (): string => {
  // Check if there's an environment variable set
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Fallback to environment-based logic
  if (process.env.NODE_ENV === 'development') {
    // For development, use localhost
    return 'http://localhost:8000';
  } else {
    // For production, use AWS EC2 instance
    return 'http://ec2-40-172-8-211.me-central-1.compute.amazonaws.com';
  }
};

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    const apiBaseUrl = getApiBaseUrl();
    
    console.log(`🔧 Next.js API Proxy: /api/* → ${apiBaseUrl}/api/*`);
    
    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/api/:path*`
      },
    ];
  },
};

export default nextConfig;
