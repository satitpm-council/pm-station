// @ts-check
const { getPackages, getPackagesPaths } = require("build-config");
const { withEsbuildOverride } = require("remix-esbuild-override");

withEsbuildOverride((option) => {
  // update the option
  option.plugins = [
    {
      name: "transpile-external-modules",
      setup(build) {
        build.onResolve(
          {
            filter: new RegExp(
              getPackages()
                .map((v) => `(${v})`)
                .join("|")
                .replace(/\//g, "/")
            ),
          },
          (args) => {
            return {
              external: false,
              namespace: args.path,
            };
          }
        );
      },
    },
    ...(option.plugins ?? []),
  ];

  return option;
});

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: ".netlify/functions-internal/server.js",
  // publicPath: "/build/",
  server: process.env.NODE_ENV === "production" ? "./server.js" : undefined,
  serverBuildPath: "api/index.js",
  serverModuleFormat: "cjs",
  serverDependenciesToBundle: [/^@station\//, "shared"],
  tailwind: true,
  postcss: true,
  watchPaths: async () => {
    return getPackagesPaths().map((p) => `../../${p}/**/*`);
  },
};
