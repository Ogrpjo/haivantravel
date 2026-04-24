import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:2031";
let apiHostname = "localhost";
let apiPort = "2031";
let apiProtocol: "http" | "https" = "http";
try {
  const u = new URL(apiUrl);
  apiHostname = u.hostname;
  apiPort = u.port || (u.protocol === "https:" ? "443" : "80");
  apiProtocol = u.protocol === "https:" ? "https" : "http";
} catch {
  // keep defaults
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "2031", pathname: "/uploads/**" },
      { protocol: "http", hostname: "localhost", port: "2031", pathname: "/upload/**" },
      { protocol: "http", hostname: "localhost", port: "2031", pathname: "/**" },
      { protocol: "http", hostname: "localhost", port: "20321", pathname: "/**" },
      { protocol: apiProtocol, hostname: apiHostname, port: apiPort, pathname: "/uploads/**" },
      { protocol: apiProtocol, hostname: apiHostname, port: apiPort, pathname: "/upload/**" },
      { protocol: "https", hostname: "api.haivanevent.vn", pathname: "/uploads/**" },
      { protocol: "https", hostname: "api.haivanevent.vn", pathname: "/upload/**" },
      { protocol: "https", hostname: "www.api.haivanevent.vn", pathname: "/uploads/**" },
      { protocol: "https", hostname: "www.api.haivanevent.vn", pathname: "/upload/**" },
      { protocol: "https", hostname: "haivanevent.vn", pathname: "/uploads/**" },
      { protocol: "https", hostname: "haivanevent.vn", pathname: "/upload/**" },
      { protocol: "https", hostname: "www.haivanevent.vn", pathname: "/uploads/**" },
      { protocol: "https", hostname: "www.haivanevent.vn", pathname: "/upload/**" },
    ],
  },
};

export default nextConfig;
