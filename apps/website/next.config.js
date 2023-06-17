const { EnvironmentPlugin } = require("webpack");

const { getPackages } = require("build-config");

const { parsed: serverEnvVars } = require("dotenv").config({
  path: "../../.env",
});

const clientEnvVars = serverEnvVars
  ? Object.fromEntries(
      Object.entries(serverEnvVars).filter(([key]) =>
        key.startsWith("NEXT_PUBLIC_")
      )
    )
  : {};

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
  transpilePackages: getPackages(),
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new EnvironmentPlugin((isServer ? serverEnvVars : clientEnvVars) ?? {})
    );
    return config;
  },
};

module.exports = nextConfig;
