import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/9.x/avataaars/svg'
      },
      {
        hostname: 'lh3.googleusercontent.com',
        protocol: 'https',
        port: '',
        pathname: '/a/**'
      }
    ]
  }
};

export default nextConfig;
// https://api.dicebear.com/9.x/avataaars/svg?seed=337987&sex=male