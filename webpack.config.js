const path = require("path");

module.exports = {
  mode: 'development',
  entry: {
    app: ['babel-polyfill', "./app.js"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  },
  performance: {
    hints: false
  },
  // devServer: {
  //   allowedHosts: [],
  //   historyApiFallback: true,
  //   after: function(app, server, compiler) {
  //     // do fancy stuff
  //   },
  //   before: function(app, server, compiler) {
  //     app.get('/some/path', function(req, res) {
  //       res.json({ custom: 'response' });
  //     });
  //   }
  // },
  module: {
    rules: [
      // {
      //   test: /\.js?$/,
      //   enforce: "pre",
      //   loader: "eslint-loader",
      //   exclude: /node_modules/,
      //   options: {
      //     emitWarning: true,
      //     configFile: "./.eslintrc.js"
      //   }
      // },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["@babel/preset-env"]
        }
      },
    ]
  }
}