const { EnvironmentPlugin } = require("webpack");

const { parsed: serverEnvVars } = require("dotenv").config({
  path: "../../.env",
});

const clientEnvVars = Object.fromEntries(
  Object.entries(serverEnvVars).filter(([key]) =>
    key.startsWith("NEXT_PUBLIC_")
  )
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new EnvironmentPlugin(isServer ? serverEnvVars : clientEnvVars)
    );
    return config;
  },
};

module.exports = nextConfig;
