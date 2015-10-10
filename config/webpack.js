var __DEV__ = process.env.NODE_ENV !== 'production'
var path    = require('path')
var Webpack = require('webpack')
var project = require('../package')

var config = {
  devtool: __DEV__ ? 'cheap-module-eval-source-map' : null,

  context: path.join(__dirname, '..'),

  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, '..', 'lib'),
    filename: project.name + '.js',
    library: project.name,
    libraryTarget: 'umd'
  },

  plugins: [
    new Webpack.DefinePlugin({
      '__DEV__': __DEV__
    })
  ],

  externals: ['sinon'],

  target: 'node',

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

if (!__DEV__) {
  config.output.filename = project.name + '.min.js'

  config.plugins = config.plugins.concat([
    new Webpack.optimize.DedupePlugin(),
    new Webpack.optimize.OccurenceOrderPlugin(),
    new Webpack.optimize.UglifyJsPlugin({ minimize: true })
  ])
}

module.exports = config
