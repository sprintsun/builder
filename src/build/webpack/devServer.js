module.exports = function({ port, publicPath, hot = false }) {
  return {
    hot,
    port,
    publicPath,
    compress: true,
    noInfo: false,
    stats: 'normal',
    inline: hot,
    lazy: false,
    disableHostCheck: true,
    host: '0.0.0.0',
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 100
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: false
    }
  }
}
