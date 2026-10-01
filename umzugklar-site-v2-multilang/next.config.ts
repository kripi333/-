import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
};

export default nextConfig;
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
