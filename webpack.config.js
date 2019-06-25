const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')

const path = require('path')
const { dependencies } = require('./package.json')

const modules = {
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
}

const electron_main = {
  target: 'electron-main',
  entry: {
    main: './index.js',
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist')
  },
  externals: [
    ...Object.keys(dependencies || {}),
    'child_process'
  ],
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      // {
      //   test: /\.js$/,
      //   use: 'babel-loader',
      //   exclude: [/node_modules/]
      // },
    ]
  },
  node: {
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['.js', '.json', '.node']
  },
  optimization: {
    minimize: false,
  },
  // plugins: [
  //   new CopyWebpackPlugin([
  //     {
  //       from: path.join(__dirname, './renderer/remotecontrol'),
  //       to: path.join(__dirname, '../dist/electron/static'),
  //       ignore: ['.*']
  //     }
  //   ])
  // ]
}

const electron_renderer = {
  target: 'electron-renderer',
  entry: {
    deckstream: './renderer/deckstream/script.js',
    livestream: './renderer/livestream/script.js',
    previewmonitor: './renderer/previewmonitor/script.js',
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist')
  },
  module: modules,
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
  },
  optimization: {
    minimize: false,
  }
}

const remote = {
  target: 'web',
  entry: {
    remotecontrol: './renderer/remotecontrol/script.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: modules,
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['remotecontrol'],
      template: "./renderer/remotecontrol/index.html",
      filename: __dirname + "/dist/remotecontrol.html",
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

module.exports = [electron_main, electron_renderer, remote]