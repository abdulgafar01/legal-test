import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "http://ec2-40-172-8-211.me-central-1.compute.amazonaws.com/api/:path*", // for backend HTTP API
          // "http://localhost:8000/api/:path*"
      },
    ];
  },
};

export default nextConfig;
