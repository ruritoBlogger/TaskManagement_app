import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const Dotenv = require('dotenv-webpack');
const src  = path.resolve(__dirname, 'src')
const pub  = path.resolve(__dirname, 'public')

export default {
  mode: 'development',
  entry: src + '/index.tsx',

  output: {
    path: pub,
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  },

  devServer: {
    contentBase: pub,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: pub + '/index.html',
      filename: 'index.html'
    }),
    new Dotenv()
  ]
}
