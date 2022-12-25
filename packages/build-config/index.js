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

module.exports = {
  getPackages,
  getPackagesPaths,
};
