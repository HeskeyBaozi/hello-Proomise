'use strict';
const path = require('path');
const webpack = require('webpack');

const dir_src = path.resolve(__dirname, '../src');
const dir_dist = path.resolve(__dirname, '../dist');

module.exports = {
    entry: {
        test: [path.resolve(dir_src, './Proomise.js'), path.resolve(dir_src, './test.js')],
        vendor: []
    },
    output: {
        path: dir_dist,
        publicPath: '/',
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015']
            }
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js', Infinity),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        hot: true,
        inline: true
    }
};