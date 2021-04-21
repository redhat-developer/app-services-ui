const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = merge(common("production", { mode: "production" }), {
  mode: "production",
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[contenthash:8].css'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'config/config.json',
          to: `config.json`
        },
        // Copy the logos for the service, for usage by third parties
        {
          from: 'static/images/Logo-Red_Hat-OpenShift_Streams_for_Apache_Kafka-A-White-RGB.png',
          to: 'Logo-Red_Hat-OpenShift_Streams_for_Apache_Kafka-A-White-RGB.png'
        },
        {
          from: 'static/images/Logo-Red_Hat-OpenShift_Streams_for_Apache_Kafka-A-Reverse-RGB.png',
          to: 'Logo-Red_Hat-OpenShift_Streams_for_Apache_Kafka-A-Reverse-RGB.png'
        },
        {
          from: 'static/images/Logo-Red_Hat-OpenShift_Streams_for_Apache_Kafka-A-Standard-RGB.png',
          to: 'Logo-Red_Hat-OpenShift_Streams_for_Apache_Kafka-A-Standard-RGB.png'
        }
      ]
    })
  ],
  output: {
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/@redhat-cloud-services/frontend-components'),
          path.resolve(__dirname, 'node_modules/patternfly'),
          path.resolve(__dirname, 'node_modules/@patternfly/patternfly'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-styles/css'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/base.css'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/esm/@patternfly/patternfly'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/node_modules/@patternfly/react-styles/css'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-table/node_modules/@patternfly/react-styles/css'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-inline-edit-extension/node_modules/@patternfly/react-styles/css')
        ],
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
});
