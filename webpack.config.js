const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const buildPath = path.resolve(__dirname, 'dist');

module.exports = env => {
  const DEBUG_MODE = process.env.DEBUG || false;

  return {
     entry: {
        index: './src/page-index/main.js',
        facebook: './src/page-facebook/main.js',
        spotify: './src/page-spotify/main.js'
     },
     mode: 'development',
     module: {
        rules: [
           {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                 loader: "babel-loader"
              }
           },
           {
              test:/\.html$/,
              use: [
                 {
                    loader: "html-loader",
                    options: { 
                       interpolate: true,
                       minimize: true
                    }
                 }
              ]
           },
           {
              test: /\.(png|svg|jpg|gif)$/,
              use: [
                 'file-loader'
              ]
           },
           {
              test: /\.scss$/,
              use: [
                 "style-loader",
                 "css-loader",
                 "sass-loader"
              ]
           }
        ]
     },
     plugins: [
        new CleanWebpackPlugin(),
        // defines environmental variables
        new DefinePlugin({
           DEBUG_MODE: DEBUG_MODE
        }),
        new HtmlWebPackPlugin({
           template: "./src/page-index/index.html",
           chunks: ['index'],
           filename: "./index.html"
        }),
        new HtmlWebPackPlugin({
           template: "./src/page-facebook/facebook.html",
           chunks: ['facebook'],
           filename: "./facebook.html"
        }),
        new HtmlWebPackPlugin({
           template: "./src/page-spotify/spotify.html",
           chunks: ['spotify'],
           filename: "./spotify.html"
        }),
        new MiniCssExtractPlugin({
           filename: "[name].css",
           chunkFilename: "[id].css"
        })
     ]
  }
};
