/**
 * @description
 * @author jiuhu <jiuhu.zh@gmail.com>
 * @date 2018/11/17
 */
const path = require('path')
const startDevServer = require('./dev')
const { createLogger } = require('../utils/logger')

function validate({ root, projectName }) {
  let result = true
  const logger = createLogger('validate')
  if (!path.isAbsolute(root)) {
    logger.error('options.root must be absolute path')
    result = false
  }
  if (!projectName) {
    logger.error('options.projectName is required')
    result = false
  }
  return result
}

module.exports = function(options) {
  if (validate(options)) {
    startDevServer(options)
  }
}
