var webpack = require('webpack');

module.exports = {
  entry: './src/GrChart.tsx',
  output: {
    filename: "giochart.min.js",
    path: __dirname + "/dist"
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
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

  externals: {
    "lodash": "_",
    "react": "React",
    "react-dom": "ReactDOM",
    "g2": "G2"
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