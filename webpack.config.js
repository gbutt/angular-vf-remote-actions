(function () {
  'use strict';

  var webpack = require('webpack');
  var path = require('path');

  module.exports = {
    // devtool: 'source-map',

    entry: {
      // 'vfrAction.provider': './src/angular1/vfrAction.provider.js',
      'VfrActionModule': path.resolve('./src/index.ts'),
      // 'VfrMock': './src/VfrMock.ts'
    },

    output: {
      path: 'dist',
      filename: '[name].js',
      library: 'VfrActionModule',
      libraryTarget: 'umd'
    },

    resolve: {
      extensions: ['', '.ts', '.js'],
    },
    module: {
      loaders: [{
        test: /\.ts$/,
        loader: 'ts',
        exclude: /node_modules/
      }]
    }

    // plugins: [
    //   new webpack.NoErrorsPlugin(),
    //   new webpack.optimize.DedupePlugin(),
    //   new webpack.optimize.UglifyJsPlugin()
    // ]
  }
})();