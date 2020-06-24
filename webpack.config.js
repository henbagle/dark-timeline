const path = require("path");
const webpack = require("webpack");

let config = {
    entry: {
        timeline:"./src/timeline.js",
        bootstrap: "./src/bootstrap.js",
        style: "./src/style.scss"
    },
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [
              {loader: "babel-loader"},
              // {loader: 'exports-loader',
              // options: {
              //     type:"commonjs",
              //     exports: 'bootstrap',
              //   },
              // },
            ],
          },
          {
            test: /\.(scss|css)$/,
            use: [{
              loader: 'style-loader', // inject CSS to page
            }, {
              loader: 'css-loader', // translates CSS into CommonJS modules
            }, {
              loader: 'postcss-loader', // Run postcss actions
              options: {
                plugins: function () { // postcss plugins, can be exported to postcss.config.js
                  return [
                    require('autoprefixer')
                  ];
                }
              }
            }, {
              loader: 'sass-loader' // compiles Sass to CSS
            }]
          },
        ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default']
    })
    ],
    resolve: {
        extensions: ['*', '.js', '.jsx', '.scss']
    },
    output: {
        path: path.join(__dirname, "public/dist"),
        filename: "[name].js",
        publicPath: "/",
    }, 
    watchOptions: {
      ignored: '/node_modules/'
    }
}

module.exports = (env, argv) => {
  if(argv.mode == 'development'){
    config.entry.eventEditor = "./src/eventEditor.js",
    config.entry.bootstrapSelect = './src/bootstrapSelect.js'
    config.watch = true;
  }

  return(config);
}