const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ApiMocker = require('webpack-api-mocker2')

const paths = require('./paths')
const baseConfig = require('./webpack.config.base.js')

const mockPath = path.resolve(__dirname, '../mock')

// const { SkeletonPlugin } = require('page-skeleton-webpack-plugin')

const SkeletonPlugin = require('spa-skeleton-webpack-plugin');



console.log(
  path.resolve(__dirname, '../shell')
)
module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              modules: true,
              namedExport: true,
              camelCase: true,
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }
          },
          'postcss-loader',
          'stylus-loader'
        ],
        include: paths.PATH_SRC,
      },
      {
        test: /\.(ts|tsx)?$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        include: paths.PATH_SRC,
      },
    //   {
    //     test:/\.(js|jsx)$/,
    //     include:paths.src,
    //     use:[
    //         {
    //             loader:require.resolve("ehome-react-skeleton")  // 在babel-loader之前配置ehome-react-skeleton
    //         }
    //     ]
    // }
    ],
  },
  plugins: [
    new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: 'index.html',
    }),
    new webpack.DefinePlugin({
      __DEV__: true,
      NODE_ENV: 'development'
    }),
    new MiniCssExtractPlugin('css/[name].css'),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new SkeletonPlugin({
      wrapEl: '#app',
      mode: 'hash',       //or history,
      templates: [
          {
            routes: '/', 
            template: path.resolve(__dirname, '../shell/index.html')
          }
      ]
    })
  ],
  optimization: {
    runtimeChunk: true,
  },
  devServer: {
    before(app) {
      ApiMocker(app, mockPath)
    },
    proxy: {
      '/webapi/github': {
        target: 'https://api.github.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/webapi/github': '/'
        },
        logLevel: 'debug',
      },
    },
    clientLogLevel: 'error',
    port: 8191,
    contentBase: paths.PATH_DIST,
    inline: true,
    hot: true,
    open: true,
    // host: '0.0.0.0',
    disableHostCheck: true,
    progress: true,
    historyApiFallback: true,
    // https: true,
  },
})
