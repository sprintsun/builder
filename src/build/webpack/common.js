const fs = require('fs')
const { resolve, relative } = require('path')
const webpack = require('webpack')
const WebpackBar = require('webpackbar')
const HappyPack = require('happypack')
const AssetsPlugin = require('assets-webpack-plugin')
const getBabelConfig = require('../babel')
const { outputPath, entry, filename } = require('../../config')

function createEntries (root) {
  const entries = {}
  const entryContext = resolve(root, entry.client)
  fs.readdirSync(entryContext)
    .filter(file => /^[a-zA-Z0-9].+\.jsx?$/.test(file))
    .forEach((file) => {
      entries[file.replace(/\.[^.]+$/, '')] = `./${relative(root, resolve(entryContext, file))}`
    })
  return entries
}

function createModuleAlias (root) {
  const moduleAlias = {}
  const client = resolve(root, 'client')
  fs.readdirSync(resolve(client))
    .filter((dir) => {
      try {
        return fs.statSync(resolve(client, dir)).isDirectory()
      } catch (e) {
        return false
      }
    })
    .forEach((dir) => { moduleAlias[`@${dir}`] = resolve(client, dir) })
  return moduleAlias
}

module.exports = function(options) {
  const { root } = options

  const distPath = resolve(root, outputPath)
  const manifest = resolve(distPath, filename.vendor)

  const config = {
    context: root,
    entry: createEntries(root),
    output: {
      path: distPath,
      filename: '[name]_[chunkhash].js'
    },
    resolve: {
      alias: createModuleAlias(root),
      extensions: ['.js', '.json']
    },
    module: {
      rules: [
        // JS
        {
          test: /\.js$/,
          use: 'happypack/loader?id=js',
          include: resolve(root, 'client')
        },
        // Common Image
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name].[hash].[ext]'
            }
          }
        },
        // SVG
        {
          test: /\.svg$/,
          use: [
            'babel-loader',
            {
              loader: 'react-svg-loader',
              options: {
                svgo: {
                  plugins: [
                    { removeTitle: true }
                  ],
                  floatPrecision: 2
                }
              }
            }
          ]
        },
        // WOFF Font
        {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
              name: '[name].[hash].[ext]'
            }
          }
        },
        // WOFF2 Font
        {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
              name: '[name].[hash].[ext]'
            }
          }
        },
        // TTF Font
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/octet-stream',
              name: '[name].[hash].[ext]'
            }
          }
        },
        // EOT Font
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]'
            }
          }
        },
      ]
    },
    plugins: [
      new WebpackBar(),
      new AssetsPlugin({
        filename: filename.assets,
        path: distPath,
      }),
      new webpack.DllReferencePlugin({ manifest }),
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
