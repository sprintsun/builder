const { resolve } = require('path')
const webpack = require('webpack')
const WebpackBar = require('webpackbar')
const HappyPack = require('happypack')
const getBabelConfig = require('../babel')
const { outputPath, filename, defaultVendor } = require('../../config')

const env = process.env.NODE_ENV
const devMode = env !== 'production'

module.exports = function(options) {
  const {
    root,
    vendor = defaultVendor,
  } = options
  const config = {
    context: root,
    mode: devMode ? 'development' : 'production',
    entry: {
      // 通用的库配置到这里, 统一打包成 vender.[chunkhash].js
      vendor
    },
    output: {
      path: resolve(root, outputPath),
      library: '[name]_[chunkhash]',
      filename: '[name]_[chunkhash].js'
    },
    module: {
      rules: [
        // JS
        {
          test: /\.js$/,
          use: 'happypack/loader?id=js',
          include: resolve(root, 'client')
        },
      ]
    },
    resolve: {
      extensions: ['.js', '.json']
    },
    plugins: [
      new WebpackBar(),
      new webpack.DllPlugin({
        path: resolve(root, outputPath, filename.vendor),
        name: '[name]_[chunkhash]'
      }),
      new HappyPack({
        id: 'js',
        threads: 4,
        verbose: false,
        loaders: [{
          loader: 'babel-loader',
          options: getBabelConfig(options)
        }],
      })
    ]
  }

  return config
}
