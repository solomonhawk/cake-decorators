var path = require('path')
var Webpack = require('webpack')

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'cake.js',
    library: 'cake',
    libraryTarget: 'umd'
  },

  target: 'node',

  resolve: {
    extensions: ['', '.js', '.json'],
    modulesDirectories: [ 'web_modules', 'node_modules', 'src' ]
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  }
}
