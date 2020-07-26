import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

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
        test: /\.jsx$/,
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
    })
  ]
}
