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

// Function to convert the webpack-dev-server v3 proxy config to v4 config
const buildv4ProxyConfig = () => {
  const proxyConfig = proxy({
    useProxy: true,
    useCloud: false,
    env: BETA ? 'prod-beta' : 'prod-stable',
    standalone: false,
    publicPath: proxyPublicPath,
    proxyVerbose: true
  });

  // Create a new object from the proxyConfig
  const answer = Object.assign({}, proxyConfig);
  // remove the old before property, it's no longer valid
  delete answer['before'];

  // create the new onBeforeSetupMiddleware property, mapping the arguments
  //Note: commenting below line of code due to compile error i.e. TypeError: proxyConfig.before is not a function at Object.answer.onBeforeSetupMiddleware 
  //answer.onBeforeSetupMiddleware = (devServer) => proxyConfig.before(devServer.app, devServer);
  return answer;
}

module.exports = merge(common('development', {
  publicPath
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
    ...buildv4ProxyConfig()
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
