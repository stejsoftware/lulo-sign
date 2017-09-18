const merge = require("webpack-merge");
const webpack = require("webpack"); // eslint-disable-line import/no-unresolved
const common = require("./webpack.common.js");

module.exports = merge(common, {
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
});
