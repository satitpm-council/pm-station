// @ts-check

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "../", "../");

/**
 * Get all available monorepo packages paths inside `packages` directory.
 * @returns {string[]}
 */
const getPackagesPaths = () => {
  return fs
    .readdirSync(path.join(rootDir, "packages"), {
      withFileTypes: true,
    })
    .filter((v) => v.isDirectory() && !v.name.includes("config"))
    .map((v) => `packages/${v.name}`);
};

/**
 * Get all available monorepo packages name.
 * @returns {string[]}
 */
const getPackages = () => {
  const paths = getPackagesPaths();
  return paths.map((package) => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(rootDir, package, "package.json"), {
        encoding: "utf-8",
      })
    );
    return packageJson.name;
  });
};

/**
 * Populate test environment variables.
 * @param {string} appName The app name to load dotenv from.
 */
const setupTestEnv = (appName) => {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
  const envFile = path.join(rootDir, `apps/${appName}/.env`);
  const env = require("dotenv").parse(fs.readFileSync(envFile, "utf8"));
  if (env.PM_STATION_SPOTIFY_TOKEN_KEY) {
    process.env.PM_STATION_SPOTIFY_TOKEN_KEY =
      env.PM_STATION_SPOTIFY_TOKEN_KEY + "_Test";
    console.log(process.env.PM_STATION_SPOTIFY_TOKEN_KEY);
  }
};

module.exports = {
  getPackages,
  getPackagesPaths,
  setupTestEnv,
};
