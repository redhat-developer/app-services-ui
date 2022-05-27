const path = require("path");
const fs = require("fs");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyPlugin = require("copy-webpack-plugin");
const { port, crc } = require("./package.json");
const proxy = require("@redhat-cloud-services/frontend-components-config-utilities/proxy");
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || port;
const PROTOCOL = process.env.PROTOCOL || "https";
const BETA = true;

const config = require("./config/config.json");

const basePublicPath = `${BETA ? "/beta" : ""}/apps`;
const publicPath = `${basePublicPath}/${crc.bundle}/`;

const distDir = path.resolve(__dirname, "./dist/");

module.exports = merge(
  common("development", {
    publicPath,
    beta: BETA,
  }),
  {
    output: {
      publicPath,
    },
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
      host: HOST,
      port: PORT,
      compress: true,
      static: {
        // publicPath,
        directory: distDir,
      },
      hot: false,
      https: PROTOCOL === "https",
      open: {
        target: [
          `https://prod.foo.redhat.com:1337${BETA ? "/beta" : ""}/${
            crc.bundle
          }/`,
        ],
      },
      allowedHosts: "all",
      devMiddleware: {
        publicPath,
        writeToDisk: true,
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
      ...proxy({
        port: PORT,
        env: BETA ? "prod-beta" : "prod-stable",
        useProxy: true,
        proxyVerbose: true,
        publicPath,
        customProxy: Object.values(config.federatedModules)
          .filter((c) => c.proxyTarget && c.fallbackBasePath)
          .map((config) => ({
            context: (path) => path.includes(config.basePath),
            target: config.proxyTarget,
            secure: false,
            changeOrigin: true,
            autoRewrite: true,
            ws: true,
            pathRewrite: { [`^${config.basePath}`]: "" },
          })),
        onBeforeSetupMiddleware: ({ chromePath }) => {
          const template = fs.readFileSync(`${chromePath}/index.html`, {
            encoding: "utf-8",
          });
          if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir);
          }

          fs.writeFileSync(`${distDir}/index.html`, template);
        },
      }),
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "config/config.json",
            to: `config.json`,
          },
        ],
      }),
    ],
  }
);
