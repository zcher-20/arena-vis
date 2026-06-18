import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "d2w9rnfcy7mm78.cloudfront.net" },
      { hostname: "images.are.na" },
    ],
  },
};

export default nextConfig;
