const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const federatedPlugin = require("@redhat-cloud-services/frontend-components-config-utilities/federated-modules");
const Dotenv = require("dotenv-webpack");
const BG_IMAGES_DIRNAME = "bgimages";
const {
  dependencies,
  peerDependencies,
  federatedModuleName,
  crc,
} = require("./package.json");
const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ChunkMapper = require("@redhat-cloud-services/frontend-components-config-utilities/chunk-mapper");

const isPatternflyStyles = (stylesheet) =>
  stylesheet.includes("@patternfly/react-styles/css/") ||
  stylesheet.includes("@patternfly/react-core/");

module.exports = (env, argv) => {
  const publicPath = argv && argv.publicPath;
  const appEntry = path.resolve(__dirname, "src", "index.tsx");

  return {
    entry: {
      app: appEntry,
    },
    module: {
      rules: [
        {
          test: new RegExp(appEntry),
          loader: path.resolve(
            __dirname,
            "./node_modules/@redhat-cloud-services/frontend-components-config-utilities/chrome-render-loader.js"
          ),
          options: {
            appName: crc.bundle,
            // skipChrome2: true, enable this line to use chrome 1 rendering
          },
        },
        {
          test: /\.s[ac]ss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
          include: (stylesheet) => !isPatternflyStyles(stylesheet),
          sideEffects: true,
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
          include: (stylesheet) => !isPatternflyStyles(stylesheet),
          sideEffects: true,
        },
        {
          test: /\.css$/,
          include: isPatternflyStyles,
          use: ["null-loader"],
          sideEffects: true,
        },
        {
          test: /\.(tsx|ts|jsx)?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: false,
                experimentalWatchApi: true,
              },
            },
          ],
        },
        // {
        //   test: /\.(ttf|eot|woff|woff2)$/,
        //   // only process modules with this loader
        //   // if they live under a 'fonts' or 'pficon' directory
        //   use: {
        //     loader: 'file-loader',
        //     options: {
        //       // Limit at 50k. larger files emited into separate files
        //       limit: 5000,
        //       name: isProduction ? '[contenthash:8].[ext]' : '[name].[ext]',
        //     },
        //   },
        // },
        // {
        //   test: /\.(svg|jpg|jpeg|png|gif)$/i,
        //   use: [
        //     {
        //       loader: 'url-loader',
        //       options: {
        //         limit: 5000,
        //         name: isProduction ? '[contenthash:8].[ext]' : '[name].[ext]',
        //       },
        //     },
        //   ],
        // },
      ],
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath,
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash:8].css",
        chunkFilename: "[contenthash:8].css",
        insert: (linkTag) => {
          const preloadLinkTag = document.createElement("link");
          preloadLinkTag.rel = "preload";
          preloadLinkTag.as = "style";
          preloadLinkTag.href = linkTag.href;
          document.head.appendChild(preloadLinkTag);
          document.head.appendChild(linkTag);
        },
      }),
      new Dotenv({
        systemvars: true,
        silent: true,
      }),
      federatedPlugin({
        root: __dirname,
        moduleName: federatedModuleName,
        exposes: {
          "./RootApp": path.resolve(__dirname, "./src/AppEntry.tsx"),
        },
        exclude: ["react-router-dom"],
        shared: [
          {
            ...dependencies,
            ...peerDependencies,
            react: {
              requiredVersion: peerDependencies.react,
            },
            "react-dom": {
              requiredVersion: peerDependencies["react-dom"],
            },
            "react-i18next": {
              singleton: true,
              requiredVersion: peerDependencies["react-i18next"],
            },
            "react-router-dom": {
              singleton: true,
              requiredVersion: peerDependencies["react-router-dom"],
            },
            "@rhoas/app-services-ui-components": {
              singleton: true,
              requiredVersion:
                peerDependencies["@rhoas/app-services-ui-components"],
            },
            "@rhoas/app-services-ui-shared": {
              singleton: true,
              requiredVersion:
                peerDependencies["@rhoas/app-services-ui-shared"],
            },
            "@scalprum/react-core": { requiredVersion: "*", singleton: true },
            "@patternfly/quickstarts": {
              requiredVersion: "*",
              singleton: true,
            },
          },
        ],
      }),
      new ChunkMapper({ modules: [federatedModuleName] }),
      new webpack.ProgressPlugin(),
    ],
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".jsx"],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, "./tsconfig.json"),
        }),
      ],
      symlinks: false,
      cacheWithContext: false,
      fallback: { url: false },
    },
  };
};
