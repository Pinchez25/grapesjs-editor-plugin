const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const outputFile = isProduction ? 'grapesjs-plugin-ckeditor5.min.js' : 'grapesjs-plugin-ckeditor5.js';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: outputFile,
      library: 'grapesjs-plugin-ckeditor5',
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.json$/,
          type: 'json',
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
        {
          test: /\.(png|jpg|gif|ttf|woff|woff2|eot)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets',
          },
        },
      ],
    },
    externals: {
      grapesjs: 'grapesjs',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: 'body',
      }),
    ],
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000,
    },
  };
};
