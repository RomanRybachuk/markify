const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Handlebars = require("./handlebars.js");
const config = require("./config.js");
const utils = require("./utils.js");

module.exports = {
  devtool: false,
  entry: {
    index: path.resolve(__dirname, "src", "index.ts"),
  },
  output: {
    filename: "[name].[fullhash].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "autoprefixer",
                    {
                      overrideBrowserslist: ["> 1%", "last 2 versions"],
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              additionalData: "@import './src/scss/variables.scss';",
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|eot|ttf|woff|woff2)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/[name][hash][ext]",
        },
      },
      {
        test: /\.hbs$/,
        loader: "html-loader",
        options: {
          preprocessor: (content, loaderContext) => {
            const page = path.parse(loaderContext.resourcePath).name;

            try {
              // Register partials and add watchers
              config.partials.forEach((partial) => {
                Handlebars.registerPartial(
                  partial.name,
                  utils.readFileContent(`src/${partial.path}`)
                );

                loaderContext.addDependency(
                  path.resolve(__dirname, "src", partial.path)
                );
              });

              const context = utils.readFileContent(
                `src/data/${page}/context.json`
              );

              return Handlebars.compile(content)(
                context
                  ? {
                      page,
                      ...JSON.parse(context),
                    }
                  : {}
              );
            } catch (error) {
              loaderContext.emitError(error);

              return content;
            }
          },
        },
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    hot: true,
    watchFiles: ["src/**/*.hbs", "src/**/*.scss"],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.hbs"),
      filename: "index.html",
      inject: true,
    }),
    ...config.pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, "src", page.path),
          filename: path.resolve(__dirname, "dist", page.name, "index.html"),
          inject: true,
        })
    ),
    new MiniCssExtractPlugin({
      filename: "[name][fullhash].css",
      chunkFilename: "[id].css",
    }),
    new CleanWebpackPlugin(),
  ],
};
