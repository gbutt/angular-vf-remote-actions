(function () {
  'use strict';

  var webpack = require('webpack');

  module.exports = {
    // devtool: 'source-map',

    entry: {
      'vfrAction.provider': './src/angular1/vfrAction.provider.js',
      'VfrActionFactoryProvider': './src/angular2/VfrActionFactoryProvider.js'
    },

    output: {
      path: 'dist',
      filename: '[name].js',
      library: 'VfrActionFactoryProvider',
      libraryTarget: 'umd'
    },

    // plugins: [
    //   new webpack.NoErrorsPlugin(),
    //   new webpack.optimize.DedupePlugin(),
    //   new webpack.optimize.UglifyJsPlugin()
    // ]
  }
})();