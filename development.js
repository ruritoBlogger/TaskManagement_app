import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const src  = path.resolve(__dirname, 'src')
const public  = path.resolve(__dirname, 'public')
const dist = path.resolve(__dirname, 'dist')

export default {
  mode: 'development',
  entry: src + '/index.js',

  output: {
    path: dist,
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
      template: public + '/index.html',
      filename: 'index.html'
    })
  ]
}
