/**
 * @description
 * @author jiuhu <jiuhu.zh@gmail.com>
 * @date 2018/11/17
 */
const net = require('net')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const buildDll = require('./dll')
const { devServer } = require('../config')
const { createLogger } = require('../utils/logger')
const { getWebpackConfig, getDevServerConfig } = require('./webpack')

const logger = createLogger('wds')

// 递归查找可用端口
function portIsOccupied (port) {
  const server = net.createServer().listen(port, '127.0.0.1')
  return new Promise((resolve, reject) => {
    server.on('listening', () => {
      logger.success(`This port ${port} is not occupied`)
      server.close()
      resolve(port)
    })

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.warning(`This port ${port} is occupied. try another.`)
        resolve(portIsOccupied(port + 1))
      } else {
        reject(err)
      }
    })
  })
}

function startWebpackDevServer (options) {
  const { devHost = devServer.host } = options
  return portIsOccupied(devServer.port).then((devPort) => {
    const publicPath = devServer.getPublicPath(devHost, devPort)
    const webpackConfig = getWebpackConfig({ ...options, publicPath })
    const devServerConfig = getDevServerConfig({ ...options, devPort, publicPath })
    WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerConfig)
    return new Promise((resolve) => {
      const compiler = webpack(webpackConfig)
      const server = new WebpackDevServer(compiler, devServerConfig)
      server.listen(devPort, devHost, () => {
        logger.success(`Webpack output is served from ${publicPath}`)
        resolve()
      });
    })
  })
}

module.exports = function(options) {
  return buildDll(options)
    .then(() => startWebpackDevServer(options))
}
