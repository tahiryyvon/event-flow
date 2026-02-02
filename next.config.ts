import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack: (config, { isServer, nextRuntime }) => {
    // Exclude heavy Node.js modules from Edge Runtime
    if (nextRuntime === 'edge') {
      config.resolve.alias = {
        ...config.resolve.alias,
        'bcryptjs': false,
        '@prisma/client': false,
      }
    }
    return config
  },
};

export default nextConfig;