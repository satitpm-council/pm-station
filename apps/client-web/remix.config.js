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
    ...option.plugins,
  ];

  return option;
});

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: "vercel",
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  assetsBuildDirectory: "public/pm-station/build",
  // serverBuildPath: ".netlify/functions-internal/server.js",
  publicPath: "/pm-station/build/",
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  serverDependenciesToBundle: [/^@station\//, "shared"],
  watchPaths: async () => {
    return getPackagesPaths().map((p) => `../../${p}/**/*`);
  },
};
