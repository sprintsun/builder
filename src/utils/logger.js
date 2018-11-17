/**
 * @description
 * @author jiuhu <jiuhu.zh@gmail.com>
 * @date 2018/11/17
 */
const chalk = require('chalk')

const symbol = {
  info: chalk.blue('ℹ'),
  success: chalk.green('✔'),
  warning: chalk.yellow('⚠'),
  error: chalk.red('✖')
};

const print = (type, category, ...args) => {
  const levelStr = symbol[type]
  const categoryStr = `｢${chalk.grey(category)}｣:`
  const contentStr = args.map(arg => `\u001b[1m\u001b[34m${JSON.stringify(arg)}\u001b[39m\u001b[22m`).join(', ')
  console.log(`${levelStr} ${categoryStr} ${contentStr}`)
};

function createLogger(logName) {
  return Object.keys(symbol).reduce((prev, curr) => {
    const temp = {}
    temp[curr] = (...args) => print(curr, logName, ...args)
    return { ...prev, ...temp }
  }, {})
}

module.exports = { createLogger }
