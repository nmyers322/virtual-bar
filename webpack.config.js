const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");
require("dotenv").config();

var configFunc = function(){
    var config = {
        devtool: "source-map",
        entry: [
            __dirname + "/app/app.js"
        ],
        output: {
            path: __dirname + "/dist",
            filename: "bundle.[hash].js",
            publicPath: "/"
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: "babel-loader",
                    exclude: [/node_modules/]
                },
                {
                    test: /\.(sass|scss|css)$/,
                    use: [
                        {
                            loader: "style-loader" // creates style nodes from JS strings
                        },
                        {
                            loader: "css-loader" // translates CSS into CommonJS
                        }
                    ]
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    use: {
                        loader: "file-loader",
                    },
                }
            ]
        },
        node: {
            fs: "empty"
        },
        plugins: [
            new HtmlWebpackPlugin({
                hash: true,
                template: path.join(__dirname , "/app/index.html"),
                inject: "body"
            }),
            new webpack.BannerPlugin("Gehenna - Virtual Bar"),
            new ExtractTextPlugin("[name]-[hash].css")
        ]};
    if(process.env.NODE_ENV !== "DEV") {
        config.plugins.push(new webpack.optimize.UglifyJsPlugin());
        config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
            name: "commons",              
            filename: "commons.js"
        }));
    }
    if(process.env.NODE_ENV === "DEV") {
        config.entry.push('webpack-hot-middleware/client?reload=true');
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }
    return config;
}();

module.exports = configFunc;