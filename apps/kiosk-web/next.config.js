const path = require("path");

require("dotenv").config({ path: "../../../.env" });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
    transpilePackages: [],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
