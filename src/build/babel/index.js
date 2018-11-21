/**
 * @description
 * @author jiuhu <jiuhu.zh@gmail.com>
 * @date 2018/11/17
 */
const { supportBrowsers } = require('../../config')

module.exports = function (options) {
  const { babelConfig, hot, browsers = supportBrowsers } = options
  const config = {
    cacheDirectory: true,
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false, // babel不做模块转换工作（webpack来处理）
          targets: { browsers }
        }
      ],
      '@babel/preset-react',
    ],
    plugins: [
      // Stage 0
      // '@babel/plugin-proposal-function-bind',

      // Stage 1
      // '@babel/plugin-proposal-export-default-from',
      // '@babel/plugin-proposal-logical-assignment-operators',
      // ['@babel/plugin-proposal-optional-chaining', { loose: false }],
      // ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
      // ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: false }],
      // '@babel/plugin-proposal-do-expressions',

      // Stage 2
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      // '@babel/plugin-proposal-function-sent',
      // '@babel/plugin-proposal-export-namespace-from',
      // '@babel/plugin-proposal-numeric-separator',
      // '@babel/plugin-proposal-throw-expressions',

      // Stage 3
      // '@babel/plugin-syntax-dynamic-import',
      // '@babel/plugin-syntax-import-meta',
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      // '@babel/plugin-proposal-json-strings',
    ],
  }
  if (hot) {
    config.plugins.unshift('react-hot-loader/babel')
  }
  return Object.assign(config, babelConfig)
}
