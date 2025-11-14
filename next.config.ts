import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignore lint errors during build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TS errors during build (temporary)
  },
};

export default nextConfig;
