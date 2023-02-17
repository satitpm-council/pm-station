/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",

        hostname: "**.googleusercontent.com",
      },
    ],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
