const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports = {
  target: 'electron-renderer',
  entry: {
    main: './index.js',
    deckstream: './renderer/deckstream/script.js',
    livestream: './renderer/livestream/script.js',
    previewmonitor: './renderer/previewmonitor/script.js',
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            extractCSS: true,
            loaders: {
              sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
              scss: 'vue-style-loader!css-loader!sass-loader',
              less: 'vue-style-loader!css-loader!less-loader'
            }
          }
        }
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: [/node_modules/]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'vue-style-loader', MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  node: {
    __dirname: false,
    __filename: false
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['deckstream'],
      template: "./renderer/deckstream/index.html",
      filename: __dirname + "/dist/deckstream.html",
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      },
      nodeModules: false
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['livestream'],
      template: "./renderer/livestream/index.html",
      filename: __dirname + "/dist/livestream.html",
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      },
      nodeModules: false
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['previewmonitor'],
      template: "./renderer/previewmonitor/index.html",
      filename: __dirname + "/dist/previewmonitor.html",
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      },
      nodeModules: false
    }),
  ],
  resolve: {
    alias: {
      '@': path.join(__dirname, '../renderer'),
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node']
  }
}
