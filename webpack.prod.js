const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

const publicPath = `${process.env.TRAVIS_BRANCH ? process.env.TRAVIS_BRANCH.includes('-beta') ? '/beta/' : '/' : '/'}apps/application-services/`

module.exports = merge(common("production", { mode: "production", publicPath }), {
  mode: "production",
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new CssMinimizerPlugin({
        minimizerOptions: {
          processorOptions: {
            preset: ['default', { mergeLonghand: false }] // Fixes bug in PF Select component https://github.com/patternfly/patternfly-react/issues/5650#issuecomment-822667560
          }
        }
      })
    ],
  },
  plugins: [
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
  }
});
