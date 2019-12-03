const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const buildPath = path.resolve(__dirname, 'dist');

module.exports = env => {
  const DEBUG_MODE = env.DEBUG || false;

  return {
    entry: {
      index: './src/page-index/main.js',
      facebook: './src/page-facebook/main.js',
      spotify: './src/page-spotify/main.js',
      tinder: './src/page-tinder/main.js',
      instagram: './src/page-instagram/main.js'
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
          test: /\.(png|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        },
        // gets inline svgs
        {
          test: /inline\.svg$/,
          loader: 'svg-inline-loader'
        },
        // gets svg source
        {
          test: /\.svg$/,
          exclude: /(inline)/,
          use: [
            'file-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV == 'development',
              }
            },
            'css-loader',
            'sass-loader',
          ]
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          use: {
            loader: "file-loader",
            options: {
              name: "fonts/[name].[ext]",
            },
          },
        },
      ]
      // 
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['**/*', '!.git', '!CNAME']
      }),
      // defines environmental variables
      new DefinePlugin({
        DEBUG_MODE: DEBUG_MODE
      }),
      new CopyPlugin([
        { from: './src/assets/animations', to: '.' }
      ]),
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
      new HtmlWebPackPlugin({
        template: "./src/page-tinder/tinder.html",
        chunks: ['tinder'],
        filename: "./tinder.html"
      }),
      new HtmlWebPackPlugin({
        template: "./src/page-instagram/instagram.html",
        chunks: ['instagram'],
        filename: "./instagram.html"
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      })
    ]
  }
};
