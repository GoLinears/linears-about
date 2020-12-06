const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = env => {
    let devtool, mode, stats;
    if (env.production !== undefined && env.production === true) {
        devtool = 'hidden-source-map';
        mode = 'production';
        stats = 'none';
    } else {
        devtool = 'eval';
        mode = 'development';
        stats = 'minimal';
    }
    return {
        devtool,
        mode,
        stats,
        module: {
            rules: [
                // JavaScript
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: ["@babel/preset-env"],
                            plugins: [
                                "@babel/plugin-proposal-class-properties",
                                "@babel/plugin-transform-runtime"
                            ]
                        }
                    }],
                },
                // Handlebars
                {
                    test: /\.hbs$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "handlebars-loader",
                            options: {
                                partialDirs: path.resolve(__dirname, "./src/components"),

                            }
                        }
                    ],
                },
                // Scss
                {
                    test: /\.s[ac]ss$/i,
                    exclude: /node_modules/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ],
                },
                // Files
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    exclude: /node_modules/,
                    use: [
                        'file-loader',
                    ],
                    type: 'asset/resource'
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    exclude: /node_modules/,
                    use: [
                        'file-loader',
                    ],
                    type: 'asset/inline'
                },
            ],
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
            },
        },
        entry: [
            path.resolve(__dirname, './src/index.js'),
        ],
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].bundle.js',
        },
        plugins: [
            new CopyPlugin({
                patterns: [{ from: "public", to: "./" }]
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, "./src/index.hbs"),
                filename: 'index.html'
            }),
            new BrowserSyncPlugin({
                host: "localhost",
                port: 3000,
                server: {
                    baseDir: [path.resolve(__dirname, './dist')]
                },
            }),
            new FriendlyErrorsWebpackPlugin(),
            new CleanWebpackPlugin({
                cleanStaleWebpackAssets: false
            }),
            new MiniCssExtractPlugin()
        ]
    }
};
