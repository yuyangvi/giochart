var webpack = require('webpack');
var path = require('path');
module.exports = {
  entry: './src/index.ts',
  output: {
    filename: "giochart.min.js",
    path: __dirname + "/dist",
    library: 'GIO',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel'}
    ]
  },
  babel: {
    babelrc: false,
    presets: [
      ['es2015'],
    ],
  },
  resolve: {
    alias: {
      'react': path.join(__dirname, 'node_modules', 'react')
    },
    extensions: ['', '.js']
  },


  externals: {
    "g2": "G2",
    "lodash": "lodash",
    'react': {
      'commonjs': 'react',
      'commonjs2': 'react',
      'amd': 'react',
      // React dep should be available as window.React, not window.react
      'root': 'React'
    },
    'react-dom': {
      'commonjs': 'react-dom',
      'commonjs2': 'react-dom',
      'amd': 'react-dom',
      'root': 'ReactDOM'
    }
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,
      },
      compress: {
        warnings: false
      }
    })
  ]

};