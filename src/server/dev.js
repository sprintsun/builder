/**
 * @description
 * @author jiuhu <jiuhu.zh@gmail.com>
 * @date 2018/11/17
 */
const path = require('path')
const nodemon = require('nodemon')
const { entry } = require('../config')
const { createLogger } = require('../utils/logger')

module.exports = function({ root }) {
  const logger = createLogger('nodemon')
  const serverEntry = path.resolve(root, entry.server)

  nodemon({
    script: serverEntry,
    watch: [serverEntry]
  });

  /* eslint-disable */
  nodemon
    .on('start', () => {
      logger.info('Main process started. watching...');
    })
    .on('crash', () => {
      logger.error('Main process crashed.');
    })
    .on('quit', () => {
      process.exit();
    })
    .on('restart', (files) => {
      if (files) {
        files = files.map((file) => {
          var _file = path.relative(root, file);
          return _file.indexOf('..') === 0 ? file : _file;
        });
        if (files.length) files = files[0];
      }
      logger.info({ changed: files }, 'Main process is going to restart...');
    })
    .on('config:update', (config = {}) => {
      const options = config.options || {};
      logger.info('Nodemon configured.');
      logger.info('输入`' + (options.restartable || 'rs') + '\'回车以手动重启进程');
    });
  /* eslint-enable */
}
