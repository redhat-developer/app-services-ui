const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { dependencies, port } = require('./package.json');
delete dependencies.serve; // Needed for nodeshift bug

// Don't include PatternFly styles twice
const reactCSSRegex = /(react-[\w-]+\/public|react-styles\/css)\/.*\.css$/;

module.exports = (env = { mkUiFrontendPort: 9000, strimziUiFrontendPort: 8080 }) => {
    const publicPath = `/beta/application-services/openshift-streams/`;
    const outputPublicPath = `https://localhost:${port}${publicPath}`;
    const mkUiFrontendPath = `https://localhost:${env.mkUiFrontendPort}/`;
    const strimziUiPath = `http://localhost:${env.strimziUiFrontendPort}/`;

    return ({
        entry: './src/index',
        mode: 'development',
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            contentBasePublicPath: publicPath,
            port,
            https: true,
            disableHostCheck: true,
            clientLogLevel: 'debug',
            historyApiFallback: {
                index: `${publicPath}/index.html`
            },
            publicPath
        },
        output: {
            path: path.resolve('public'),
            publicPath: outputPublicPath
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    options: {
                        presets: ['@babel/preset-react']
                    }
                },
                {
                    test: /\.(svg|ttf|eot|woff|woff2|jpg|jpeg|png|gif)$/,
                    use: 'file-loader'
                },
                {
                    test: /\.s?css$/,
                    exclude: reactCSSRegex,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: { hmr: !env.prod }
                        },
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: reactCSSRegex,
                    use: 'null-loader'
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin(),
            new webpack.container.ModuleFederationPlugin({
                name: 'nav',
                filename: 'remoteEntry.js',
                remotes: {
                    mkUiFrontend: `mkUiFrontend@${mkUiFrontendPath}remoteEntry.js`,
                    strimziUi: `strimziUi@${strimziUiPath}remoteEntry.js`
                },
                shared: {
                    ...dependencies,
                    react: {
                        eager: true,
                        singleton: true,
                        requiredVersion: dependencies.react
                    },
                    'react-dom': {
                        eager: true,
                        singleton: true,
                        requiredVersion: dependencies['react-dom']
                    }
                }
            }),
            new HtmlWebpackPlugin({
                template: './src/index.html'
            })
        ]
    });
};
