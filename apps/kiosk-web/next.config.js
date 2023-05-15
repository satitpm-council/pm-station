const path = require("path");
const { getPackages } = require("build-config");
const { DefinePlugin } = require("webpack");

require("dotenv").config({ path: "../../.env" });

// Although Next.js provides 'NEXT_PUBLIC' prefixes for env to be exposes to client
// We just want to preserve variable names on both frameworks.
// As a result, we implement a custom logic that will pass specific public env variables.
const injectedEnvVars = Object.fromEntries(
  // This seems to be vulnerable, but environments are exposed to system when building on Vercel.
  Object.entries(process.env)
    // For example, PM_STATION_FIREBASE(_PUBLIC_)APP_ID should pass,
    // but SOMETHING_PUBLIC shouldn't.
    .filter(([k]) => k.includes("_PUBLIC_"))
    .map(([k, v]) => [`process.env.${k}`, JSON.stringify(v)])
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    serverActions: true,
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
  transpilePackages: getPackages(),
  webpack: (config) => {
    config.plugins.push(new DefinePlugin(injectedEnvVars));
    // allow code reuse on both frameworks
    config.resolve.extensions = [
      ".next.ts",
      ".next.tsx",
      ...config.resolve.extensions,
    ];
    return config;
  },
};

module.exports = nextConfig;
