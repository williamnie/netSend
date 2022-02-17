'use strict';

const path = require('path');
const { dependencies } = require('../package.json')

const genExternalPackages = () => {
  const external = {}
  for (const key in dependencies) {
    external[key] = `require('${key}')`
  }
  return external
}

module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist/main'),
    filename: '[name].js',
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.jsx', '.ts', '.js', '.json'],
  },
  devtool: 'source-map',
  externals: genExternalPackages()
};
