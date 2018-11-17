/**
 * @description
 * @author jiuhu <jiuhu.zh@gmail.com>
 * @date 2018/11/17
 */
const path = require('path')
const fse = require('fs-extra')
const webpack = require('webpack')
const { outputPath } = require('../config')
const { createLogger } = require('../utils/logger')
const { getDllConfig } = require('./webpack')

module.exports = function buildDll(options, force) {
  const { root } = options
  const logger = createLogger('dll')
  const distPath = path.resolve(root, outputPath)
  const vendorPath = path.resolve(distPath, 'vendor.json')

  if (!force && fse.existsSync(vendorPath)) {
    logger.success('vendor.js build successful');
    return Promise.resolve();
  }

  logger.info('vendor.js building...');
  return new Promise((resolve, reject) => {
    fse.emptyDirSync(distPath)
    webpack(getDllConfig(options), (err, stats) => {
      if (err) {
        logger.error('vendor.js build failed')
        reject(err)
        return
      }

      const info = stats.toJson()
      if (stats.hasErrors()) {
        console.error(info.errors)
      }
      if (stats.hasWarnings()) {
        console.warn(info.warnings)
      }
      console.log(stats.toString({
        chunks: true, // 打印构建过程
        colors: true // 在控制台展示颜色
      }))
      logger.success('vendor.js build successful')
      resolve()
    })
  })
}
