/**
 * @description
 * @author jiuhu <jiuhu.zh@gmail.com>
 * @date 2018/11/17
 */
const getDevConfig = require('./dev')
const getProdConfig = require('./prod')
const getDevServerConfig = require('./devServer')
const getDllConfig = require('./dll')

function getWebpackConfig(options) {
  return process.env.NODE_ENV !== 'production' ? getDevConfig(options) : getProdConfig(options)
}

module.exports = {
  getWebpackConfig,
  getDllConfig,
  getDevServerConfig
}
