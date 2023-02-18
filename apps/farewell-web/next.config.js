/** @type {import('next').NextConfig} */
const nextConfig = {
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
        source: "/farewell/:match*",
        destination: "/:match*",
      },
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
