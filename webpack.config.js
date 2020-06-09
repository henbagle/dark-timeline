const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: {
        eventEditor:"./src/eventEditor.js",
        timeline:"./src/timeline.js"
    },
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader"
            }
          }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: path.join(__dirname, "public/dist"),
        filename: "[name].js",
        publicPath: "/"
    }, 
}