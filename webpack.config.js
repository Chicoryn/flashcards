const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

const app = {
    target: 'node',
    entry: {
        index: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs',
        filename: '[name].js'
    },
    node: {
        __dirname: false,
        __filename: false,
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }
        ]
    },
    externals: [ /^(?!\.|\/).+/i, ]
};

const web = {
    target: 'web',
    entry: {
        bundle: './src/bundle.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/assets/',
        filename: '[name].js'
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.html$/, use: 'html-loader' }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/assets/index.html',
            filename: './index.html'
        })
    ]
};

module.exports = [app, web];
