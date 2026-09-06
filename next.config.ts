import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 60 * 60 * 3,
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
      // supabase buckets
      {
        hostname: 'khqlrecfncqrctilbjwx.supabase.co',
        protocol: 'https',
        port: '',
        pathname: '/storage/v1/object/public/**'
      },
      {
        hostname: 'khqlrecfncqrctilbjwx.supabase.co',
        protocol: 'https',
        port: '',
        pathname: '/rest/v1/storage/v1/object/public/**'
      },
    ]
  },
  allowedDevOrigins: ['10.16.159.171', '10.57.116.170', '10.16.220.170', '10.69.240.170']
};

export default nextConfig;
// https://api.dicebear.com/9.x/avataaars/svg?seed=337987&sex=male
// https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/0.jpg
// https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/no_profile%20(1).jpg
// https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/1c35ccc8-aa05-4e63-871f-5cb207355b32/avatar.png
// https://khqlrecfncqrctilbjwx.supabase.co/storage/v1/object/public/avatar/no_profile%20(1).jpg