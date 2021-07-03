var webpackConfig = require('./webpack.config')

webpackConfig.devtool = 'inline-source-maps'
webpackConfig.cache = true

module.exports = function (config) {
  config.set({
    frameworks: [
      'mocha',
      'chai',
    ],
    files: [
      //'test/helper.js',
      'test/**/*-test.js',
    ],
    preprocessors: {
      'test/**/*.js': [ 'webpack' ],
      'src/**/*.js': [ 'webpack' ],
    },
    browsers: [
      'PhantomJS',
    ],
    reporters: [
      'nyan',
    ],
    singleRun: true,
    webpack: webpackConfig,
    webpackServer: {
      quiet: false,
      noInfo: true,
    },
  })
}
