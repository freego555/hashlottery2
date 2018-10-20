var glob = require("glob");

module.exports = {
  entry: glob.sync("./src/js/*.js"),
  output: {
    path: __dirname + "/build/js",
    filename: "bundle.js"
  },
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  },
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    "jquery": "jQuery"
  }
}