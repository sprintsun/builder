/**
 * @description
 * @author jiuhu <jiuhu.zh@gmail.com>
 * @date 2018/11/17
 */
const path = require('path')
const devBuild = require('./dev')
const prodBuild = require('./prod')
const { createLogger } = require('../utils/logger')

const env = process.env.NODE_ENV
const devMode = env !== 'production'

function validate({ root }) {
  let result = true
  const logger = createLogger('validate')
  if (!path.isAbsolute(root)) {
    logger.error('options.root must be absolute path')
    result = false
  }
  return result
}

module.exports = function(options) {
  if (validate(options)) {
    return devMode ? devBuild(options) : prodBuild(options)
  }
  return Promise.reject()
}
