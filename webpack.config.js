const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/main.js',
    publicPath: '/'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    filename: 'js/main.js',
    publicPath: '/',
    hot: true,
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|bin|mtl|obj|gltf|glb)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/models'
        }
      }
    ]
  },
  plugins: [
    // new CopyPlugin([{from: './assets/models', to: './dist/assets/models'}])
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.bin']
  }
};
