const webpack = require("webpack"); // eslint-disable-line import/no-unresolved
const path = require("path");

module.exports = {
  context: path.join(__dirname, "./client"),
  entry: "./index.jsx",
  output: {
    path: path.join(__dirname, "./public/dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env", "stage-0", "react"]
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      jsonpath: path.join(__dirname, "./node_modules/jsonpath/jsonpath.js")
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development")
      }
    })
  ]
};
