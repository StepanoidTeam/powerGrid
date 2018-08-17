const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
//const PwaManifestWebpackPlugin = require("pwa-manifest-webpack-plugin");

const title = "🏝 Friends Trip";

module.exports = {
  entry: {
    index: "./src/index.js",
    app: "./src/js/app.js",
    login: "./src/js/login.js",
    web: "./src/js/web.js"
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(["dist/*"]),

    new HtmlWebpackPlugin({
      title: `${title}`,
      filename: "index.html",
      template: "src/index.html",
      chunks: ["index", "web", "login", "runtime", "vendors"]
    }),

    //todo: create manifest, and somehow attach it to page
    // new PwaManifestWebpackPlugin({
    //   name: "Todos",
    //   description: "a todo demo of pwa",

    //   includeDirectory: true,
    //   filename: `app-manifest.json`,
    //   icons: [
    //     {
    //       ios: true,
    //       sizes: [512, 36, 48, 192],
    //       destination: "dist",
    //       src: "./src/styles/cake.png"
    //     }
    //   ]
    // }),

    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  output: {
    path: __dirname + "/dist",
    //publicPath: "/",
    //filename: "[name].[hash].js",
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },

      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 12000
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },

  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },
  devtool: "eval-source-map",
  devServer: {
    contentBase: "./dist",
    hot: true
  }
};
