const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true,
    https: true
});

delete webpackConfig.serve;
delete webpackConfig.node;

console.log(webpackConfig);
console.log(plugins);

module.exports = {
    ...webpackConfig,
    plugins
};
