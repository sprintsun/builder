const path = require('path')
const merge = require('webpack-merge')
const autoprefixer = require('autoprefixer')
// const HappyPack = require('happypack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const getCommonConfig = require('./common')
const { supportBrowsers, outputPath, filename } = require('../../config')

const openAnalyzer = !!process.env.ANALYZER

module.exports = function(options) {
  const {
    root,
    webpackConfig,
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
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.styl$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            postCssLoader,
            'stylus-loader'
          ],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            postCssLoader
          ],
        }
      ]
    },
    plugins: [
      // new HappyPack({
      //   id: 'css',
      //   threads: 4,
      //   loaders: ['css-loader']
      // }),
      // new HappyPack({
      //   id: 'styl',
      //   threads: 4,
      //   loaders: ['css-loader', 'stylus-loader']
      // }),
      new MiniCssExtractPlugin({
        filename: '[name]_[contenthash].css'
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      }),
      new AssetsPlugin({
        filename: filename.assets,
        path: path.resolve(root, outputPath),
      }),
      new BundleAnalyzerPlugin({
        openAnalyzer,
        analyzerMode: openAnalyzer ? 'server' : 'disabled',
        analyzerHost: '127.0.0.1',
        analyzerPort: 9999,
        reportFilename: 'report.html',
        logLevel: 'info'
      })
    ]
  }
  return merge.smart(getCommonConfig(options), config, webpackConfig)
}
