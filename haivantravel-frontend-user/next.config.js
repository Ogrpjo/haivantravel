/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "2031",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "20321",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.haivanevent.vn",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
