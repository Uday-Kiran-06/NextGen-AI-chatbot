import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '10.13.39.8:3000', '*.ngrok-free.app']
    },
    // @ts-expect-error - turbopack options are not yet in NextConfig type
    turbopack: {
      root: process.cwd(),
    },
  },

};

export default nextConfig;
