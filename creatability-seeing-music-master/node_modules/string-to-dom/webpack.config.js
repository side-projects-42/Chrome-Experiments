var pkg = require('./package.json')
var webpack = require('webpack')

module.exports = {
  entry: [ pkg.config.mainFile ],
  output: {
    path: __dirname + '/lib',
    filename: 'index.js',
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',//?stage=0',
      },
    ],
  },
}
