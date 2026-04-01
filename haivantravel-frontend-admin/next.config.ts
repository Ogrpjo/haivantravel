import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "2031",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.haivanevent.vn",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.haivanevent.vn",
        pathname: "/upload/**",
      },
    ],
  },
};

export default nextConfig;