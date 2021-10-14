const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyPlugin = require('copy-webpack-plugin');
const { port, crc } = require('./package.json');
const proxy = require('@redhat-cloud-services/frontend-components-config-utilities/proxy');
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || port;
const BETA = true;

const basePublicPath = `${BETA ? '/beta' : ''}/apps`
const proxyPublicPath = `${BETA ? '/beta' : ''}/${crc.bundle}/`
const publicPath = `${basePublicPath}/${crc.bundle}/`;

module.exports = merge(common('development', {
  publicPath, beta: BETA
}), {

  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    static: {
      publicPath,
      directory: "./dist",
    },
    host: HOST,
    port: PORT,
    compress: true,
    historyApiFallback: {
      index: `${publicPath}index.html`
    },
    hot: true,
    client: {
      overlay: true,
      webSocketURL: 'ws://localhost:7003/ws'
    },
    webSocketServer: {
      type: "ws",
      options: {
        host: "localhost",
        port: 7003,
        path: "/ws"
      }
    },
    open: {
      target: [`https://prod.foo.redhat.com:1337${BETA ? '/beta' : ''}/${crc.bundle}/`]
    },
    allowedHosts: "all",
    devMiddleware: {
      publicPath,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    ...proxy({
      useProxy: true,
      useCloud: false,
      env: BETA ? 'prod-beta' : 'prod-stable',
      standalone: false,
      publicPath: proxyPublicPath,
      proxyVerbose: true
    })
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'config/config.json',
          to: `config.json`
        }
      ]
    })
  ]
});
