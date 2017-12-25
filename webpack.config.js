const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 解耦css和js文件hash值
const WebpackMd5Hash = require('webpack-md5-hash');

// 防止文件产生过多，先删除dist下的文件。
let fs = require('fs');
let folder_exists = fs.existsSync('./dist');
if(folder_exists == true)
{
    let dirList = fs.readdirSync('./dist');
    dirList.forEach(function(fileName)
    {
        fs.unlinkSync('./dist/' + fileName);
    });
}

module.exports={
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use:[
                        {
                            loader: 'css-loader',
                            options: {
                                // If you are having trouble with urls not resolving add this setting.
                                // See https://github.com/webpack-contrib/css-loader#url
                                url: false,
                                minimize: true,
                                sourceMap: true
                            } 
                        }/* ,
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        } */
                    ]
                    
                })
            }
        ]
    },
    entry: {
        vendor: ['moment','lodash'],
        app:'./app/index.js'
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
        // sourceMapFilename: '[name].js.map'
    },
    // devtool:'cheap-module-source-map',//'source-map',
    plugins:[
        // new webpack.NamedModulesPlugin(),
        /* new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor' // 指定公共 bundle 的名字。
        }), 
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['app','vendor'] //可不写
        }), */
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'] // 指定公共 bundle 的名字。
        }),
        new ExtractTextPlugin('[name].[contenthash].css'), //提取css
        new HtmlWebpackPlugin({
            title: '制作一个长效缓存的APP页面',
            inject:true,    //允许插件修改哪些内容，true/'head'/'body'/false,
            // chunks:['manifest',vendors','app'],//加载指定模块中的文件，否则页面会加载所有文件
            filename: 'index.html',
            template: './public/index.html',
            minify:{    //压缩HTML文件
                removeComments:false,    //移除HTML中的注释
                collapseWhitespace:false    //删除空白符与换行符
             }
        }),
        new webpack.SourceMapDevToolPlugin({
            test: [/\.js$/],
            exclude: 'vendor',
            filename: '[name].[chunkhash].js.map',//'[file].map',
            // exclude: ['vendor.js']
            // moduleFilenameTemplate: '[resource-path]',
            // fallbackModuleFilenameTemplate: '[resource-path]',
        }),
        //压缩js文件
         new webpack.optimize.UglifyJsPlugin({
            test: [/\.js$/],
            exclude:'app',
            uglifyOptions:{
                compress: {
                    warnings: false
                }
            }
        }),
        new WebpackMd5Hash() //解决css从主js文件分离时的hash问题
    ]
}
