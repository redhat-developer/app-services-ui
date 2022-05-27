const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlReplaceWebpackPlugin = require("html-replace-webpack-plugin");
const { crc } = require("./package.json");

const AppServicesUiComponentsPath = `node_modules/@rhoas/app-services-ui-components`;

/**
 * The deploy on stable is currently using beta assets.
 * The puclich path has to be fixed once stable uses stable assets.
 * The /beta prefix must be removed for stable env to load correct modules.
 */
const publicPath = "/beta/apps/application-services/";

module.exports = merge(
  common("production", { mode: "production", publicPath }),
  {
    mode: "production",
    devtool: "source-map",
    optimization: {
      minimizer: [
        new TerserJSPlugin({}),
        new CssMinimizerPlugin({
          minimizerOptions: {
            processorOptions: {
              preset: ["default", { mergeLonghand: false }], // Fixes bug in PF Select component https://github.com/patternfly/patternfly-react/issues/5650#issuecomment-822667560
            },
          },
        }),
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "index.html"),
        templateParameters: {
          appName: crc.bundle,
        },
        inject: false,
        minify: {
          collapseWhitespace: true,
          keepClosingSlash: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyJS: true,
        },
      }),
      new HtmlReplaceWebpackPlugin([
        {
          pattern: "@@env",
          replacement: publicPath,
        },
      ]),
      new CopyPlugin({
        patterns: [
          {
            from: "config/config.json",
            to: `config.json`,
          },
          // Copy the logos for the service, for usage by third parties
          {
            from: `${AppServicesUiComponentsPath}/static/images/Logo-Red_Hat-OpenShift_Streams_for_Apache_Kafka-A-White-RGB.png`,
            to: "Logo-Red_Hat-OpenShift_Streams_for_Apache_Kafka-A-White-RGB.png",
          },
          {
            from: `${AppServicesUiComponentsPath}/static/images/Logo-Red_Hat-OpenShift_Streams_for_Apache_Kafka-A-Reverse-RGB.png`,
            to: "Logo-Red_Hat-OpenShift_Streams_for_Apache_Kafka-A-Reverse-RGB.png",
          },
          {
            from: `${AppServicesUiComponentsPath}/static/images/Logo-Red_Hat-OpenShift_Streams_for_Apache_Kafka-A-Standard-RGB.png`,
            to: "Logo-Red_Hat-OpenShift_Streams_for_Apache_Kafka-A-Standard-RGB.png",
          },
          {
            from: `${AppServicesUiComponentsPath}/static/images/Logo-Red_Hat-OpenShift-Application_Services-A-Reverse-RGB.svg`,
            to: "Logo-Red_Hat-OpenShift-Application_Services-A-Reverse-RGB.svg",
          },
          {
            from: `${AppServicesUiComponentsPath}/static/images/Logo-Red_Hat-OpenShift_Streams_for_Apache_Kafka-A-Reverse-RGB-310x117.png`,
            to: "Logo-Red_Hat-OpenShift_Streams_for_Apache_Kafka-A-Reverse-RGB-310x117.png",
          },
          {
            from: `${AppServicesUiComponentsPath}/static/images/Logo-Red_Hat-OpenShift-API_Management-A-Standard-RGB.svg`,
            to: "Logo-Red_Hat-OpenShift-API_Management-A-Standard-RGB.svg",
          },
          // Deprecated - should be removed after 01/04/2022
          {
            from: "static/configs/terms-conditions-spec.json",
            to: "terms-conditions-spec.json",
          },
          {
            from: "static/configs/service-constants.json",
            to: "service-constants.json",
          },
        ],
      }),
    ],
    output: {
      filename: "[name].[contenthash].js",
    },
  }
);
