const webpack = require('webpack')
const merge = require('webpack-merge')
const autoprefixer = require('autoprefixer')
const { supportBrowsers } = require('../../config')
const getCommonConfig = require('./common')

module.exports = function(options) {
  const {
    hot,
    webpackConfig,
    publicPath,
    browsers = supportBrowsers
  } = options

  const postCssLoader = {
    loader: 'postcss-loader',
    options: {
      plugins() {
        return [autoprefixer({ browsers })]
      }
    }
  }

  const config = {
    mode: 'development',
    output: {
      publicPath,
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.styl$/,
          use: [
            'style-loader',
            'css-loader',
            postCssLoader,
            'stylus-loader'
          ],
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            postCssLoader
          ],
        }
      ]
    },
    plugins: []
  }

  if (hot) {
    // https://webpack.js.org/guides/hot-module-replacement/
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  return merge.smart(getCommonConfig(options), config, webpackConfig)
}
