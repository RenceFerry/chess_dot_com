import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 7,
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
      },
      {
        hostname: 'cdn.jsdelivr.net',
        protocol: 'https',
        port: '',
        pathname: '/gh/faker-js/assets-person-portrait/**'
      },
      {
        hostname: 'avatars.githubusercontent.com',
        protocol: 'https',
        port: '',
        pathname: '/u/**'
      },
      {
        hostname: 'khqlrecfncqrctilbjwx.supabase.co',
        protocol: 'https',
        port: '',
        pathname: '/storage/v1/object/public/**'
      }
    ]
  }
};

export default nextConfig;
// https://api.dicebear.com/9.x/avataaars/svg?seed=337987&sex=male
// https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/0.jpg