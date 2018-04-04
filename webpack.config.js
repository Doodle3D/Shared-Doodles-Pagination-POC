const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const devMode = process.env.NODE_ENV !== 'production';
const DB_URL = 'https://7de49b2e-f079-44f0-8ae2-09b389d58075-bluemix.cloudant.com/doodle3d-shared-sketches';

const babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: [
      require('babel-preset-env'),
      require('babel-preset-stage-0'),
      require('babel-preset-react')
    ],
    plugins: [
      require('babel-plugin-transform-class-properties'),
      require('babel-plugin-transform-object-rest-spread'),
      require('babel-plugin-transform-runtime'),
      require('babel-plugin-transform-es2015-classes')
    ],
    babelrc: false
  }
};

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: babelLoader
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        DB_URL: JSON.stringify(DB_URL)
      }
    }),
    new HTMLWebpackPlugin({
      title: 'Shared Doodles',
      template: require('html-webpack-template'),
      inject: false,
      appMountId: 'app'
    })
  ],
  devtool: devMode ? 'source-map' : false,
  devServer: {
    contentBase: 'dist'
  }
};
