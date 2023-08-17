import "./env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      { protocol: "https", hostname: "i.scdn.co" },
    ],
  },
  experimental: {
    serverActions: true,
  },
  transpilePackages: ["@station/db"],
};

export default nextConfig;
