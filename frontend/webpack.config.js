const path = require('path')
const webpack = require('webpack')
const WebpackMd5Hash = require('webpack-md5-hash')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')

const config = {
  entry: {
    vendor: './src/vendor.js',
    main: './src/app.jsx',
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity,
    }),
    new WebpackMd5Hash(),
    new InlineManifestWebpackPlugin({
      name: "webpackManifest"
    }),
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
    })
  ],
  module: {
    rules: [{
      test: /jsx$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['react', 'es2015']
        }
      }
    }]
  }
}

module.exports = [config]
