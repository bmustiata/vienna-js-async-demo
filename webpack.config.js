var SmartBannerPlugin = require('smart-banner-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var fs = require("fs")
var localNodeModules = fs.readdirSync("node_modules")

localNodeModules.splice(0, 0, "fs", "net", "path", "uuid/v4")

module.exports = [{ // server
  entry: ['babel-polyfill', './src/server/main.js'],
  output: {
    filename: 'out/main.js',
    library: true,
    libraryTarget : 'commonjs2'
  },
  externals: localNodeModules,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2017', 'es2015']
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
    {
        from: 'src/html',
        to: 'out/public'
    }
    ]),
    new SmartBannerPlugin('require("source-map-support/register");\n',
        {raw: true, entryOnly: false })
  ],
  devtool: 'source-map'
}, { // client
  entry: ['babel-polyfill', './src/client/client.js'],
  output: {
    filename: 'out/public/client.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2017', 'es2015']
        }
      },
      {
        test: /\.html$/,
        loader: 'html'
      }
    ]
  },
  devtool: 'source-map'
}]

