const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { dependencies, port } = require('./package.json');
delete dependencies.serve; // Needed for nodeshift bug
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');

// Don't include PatternFly styles twice
const reactCSSRegex = /(react-[\w-]+\/public|react-styles\/css)\/.*\.css$/;

module.exports = (env = { mkUiFrontendPort: 9000 }, argv) => {
    const isProd = argv.mode === 'production';
    const { remoteSuffix } = env;
    const publicPath = (isProd && remoteSuffix)
        ? `http://nav${remoteSuffix}/`
        : `https://localhost:${port}/mkui/mkui/`;
    const mkUiFrontendPath = (isProd && remoteSuffix)
        ? `http://mkUiFrontend${remoteSuffix}/`
        : `http://localhost:${env.mkUiFrontendPort}/`;

    return ({
        entry: './src/index',
        mode: 'development',
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            port,
            https: true,
            disableHostCheck: true,
            clientLogLevel: 'debug',
            publicPath: '/mkui/mkui/'
        },
        output: {
            path: path.resolve('public'),
            publicPath
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
                    mkUiFrontend: `mkUiFrontend@${mkUiFrontendPath}remoteEntry.js`
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
