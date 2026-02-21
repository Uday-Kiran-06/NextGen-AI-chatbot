import type { NextConfig } from "next";

const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '10.13.39.8:3000', '*.ngrok-free.app']
    },
    optimizePackageImports: ['@phosphor-icons/react'],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
