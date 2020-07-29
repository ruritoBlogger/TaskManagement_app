import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const Dotenv = require('dotenv-webpack');
const src  = path.resolve(__dirname, 'src')
const pub  = path.resolve(__dirname, 'public')

export default {
  mode: 'development',
  entry: src + '/index.js',

  output: {
    path: pub,
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: pub + '/index.html',
      filename: 'index.html'
    }),
    new Dotenv()
  ]
}
