/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/farewell",
  images: {
    formats: ["image/avif", "image/webp"],
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
  async rewrites() {
    return [
      {
        source: "/qr",
        destination: "/api/code",
      },
      {
        source: "/share",
        destination: "/api/code",
      },
    ];
  },
};

module.exports = nextConfig;
