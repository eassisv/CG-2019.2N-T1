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
    writeToDisk: true,
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
        test: /\.(jpg|png|bin|mtl|obj|gltf|glb|fbx)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/models'
        }
      }
    ]
  },
  // plugins: [new CopyPlugin([{from: './assets/models', to: './assets/models'}])],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.bin']
  }
};
