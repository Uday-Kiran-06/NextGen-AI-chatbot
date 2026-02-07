import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '10.13.39.8:3000', '*.ngrok-free.app']
    }
  },
  // @ts-ignore - Suppress TS error for turbopack config at root
  turbopack: {
    root: 'C:\\Users\\ASUS\\.gemini\\antigravity\\scratch\\nextgen-chatbot',
  }
};

export default nextConfig;
