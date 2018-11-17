const webpack = require('webpack')
const buildDll = require('./dll')
const { getWebpackConfig } = require('./webpack')
const { createLogger } = require('../utils/logger')

function build(options) {
  const logger = createLogger('webpack')
  logger.info('assets building...')
  return new Promise((resolve, reject) => {
    webpack(getWebpackConfig(options), (err, stats) => {
      if (err) {
        logger.error('assets build failed')
        reject(err)
        return
      }

      const info = stats.toJson()
      if (stats.hasErrors()) {
        console.error('build error:', info.errors)
        logger.error('assets build failed')
        reject(info.errors)
        return
      }
      if (stats.hasWarnings()) {
        console.warn('build warning:', info.warnings)
      }
      console.log(stats.toString({
        chunks: false, // 打印构建过程
        colors: true // 在控制台展示颜色
      }))
      logger.success('assets build successful')
      resolve()
    })
  })
}

module.exports = function(options) {
  return buildDll(options, true)
    .then(() => build(options))
}
