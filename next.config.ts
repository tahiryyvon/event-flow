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
  webpack: (config, { isServer, nextRuntime, dev }) => {
    // Exclude heavy Node.js modules from Edge Runtime
    if (nextRuntime === 'edge') {
      config.resolve.alias = {
        ...config.resolve.alias,
        'bcryptjs': false,
        '@prisma/client': false,
      }
    }

    // Reduce webpack noise in development
    if (dev && !isServer) {
      config.stats = {
        ...config.stats,
        warnings: false,
      }
    }

    return config
  },
  // Reduce build verbosity
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;