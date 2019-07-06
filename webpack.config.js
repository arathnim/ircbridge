/* eslint-disable import/no-extraneous-dependencies,global-require */

const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')


const babelOpts = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: [
    'babel-loader',
  ],
}

const SassOpts = {
  test: /\.sass$/,
  exclude: /node_modules/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader?modules',
      'sass-loader',
    ],
}

const cssOpts = {
  test: /\.css$/,
  use : [
    MiniCssExtractPlugin.loader,
    'css-loader',
  ]
}

const mjsOpts = {
   test: /\.mjs$/,
   include: /node_modules/,
   type: 'javascript/auto'
}

const pluginList = [
  new MiniCssExtractPlugin({
    filename: "[name].[contenthash].css",
    chunkFilename: "[id].css"
  }),
  new HtmlWebpackPlugin({
    template: './client/index.ejs',
    inject: false,
    title: 'title',
    appMountId: 'main',
    devServer: '',
  }),
  new CompressionPlugin,
]

const stats = {
  chunks: false,
  modules: false,
  children: false,
  colors: true,
}

module.exports = {
  entry: './client/index',
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.sass', '.mjs', '.gql', '.graphql'],
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'public'),
  },
  mode: 'development',
  module: {
    rules: [
      babelOpts,
      cssOpts,
      SassOpts,
      mjsOpts,
    ],
  },
  plugins: pluginList,
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    publicPath: '/',
    stats,
  },
  stats,
}
