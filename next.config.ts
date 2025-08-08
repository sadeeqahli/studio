import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
  experimental: {
    allowedDevOrigins: [
      'https://6000-firebase-naija-pitch-connect-1753143323053.cluster-6frnii43o5blcu522sivebzpii.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
