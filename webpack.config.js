const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('./package.json');
const webpack = require('webpack');
const fs = require('fs');
const name = pkg.name;
const env = process.env.WEBPACK_ENV;
let plugins = [
  new webpack.BannerPlugin(`${name} - ${pkg.version}`),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: false
  })
];
let outputFile;

if (env === 'build') {
  outputFile = `${name}.min.js`;
  plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true, compressor: { warnings: false }}));
} else {
  outputFile = `${name}.js`;
}

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: name,
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    grapesjs: 'grapesjs'
  },
  plugins: plugins,
};
