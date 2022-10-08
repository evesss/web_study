// node.js核心模块，专门用来处理路径问题
const path = require("path")
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  // 入口
  entry: './src/main.js',
  // 输出
  output: {
    // 所有文件的输出路径
    // 开发模式没有输出
    path: undefined,
    // 入口文件打包输出文件名
    filename: "static/js/main.js",
    // 自动清空上次打包的内容
    // 原理：在打包前，将path整个目录内容清空，再进行打包
    // 开发模式没有输出，不需要清空结果
    // clean: true
  },
  // 加载器
  module: {
    rules: [
      // loader的配置
      {
        // 每个文件只能被其中一个loader配置处理
        oneOf: [
          {
            test: /\.css$/i, // 只检测xxx文件
            use: [
              // 执行顺序，从右到左（从下到上）
              "style-loader", // 将js中css通过创建style标签添加html文件中生效
              "css-loader" // 将css资源编译成commonjs的模块到js中
            ],
          },
          {
            test: /\.less$/i,
            // loader: xxx,  // 只能使用1个loader
            use: [
              // 使用多个loader
              'style-loader',
              'css-loader',
              'less-loader',
            ]
          },
          {
            test: /\.s[ac]ss$/i,
            use: [
              // 将 JS 字符串生成为 style 节点
              'style-loader',
              // 将 CSS 转化成 CommonJS 模块
              'css-loader',
              // 将 Sass 编译成 CSS
              'sass-loader',
            ],
          },
          {
            test: /\.(png|jpe?g|gif|webp|svg|PNG)$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                // 小于200kb的图片转base64
                // 优点：减少请求数量 缺点：体积会更大
                maxSize: 200 * 1024 // 200kb
              }
            },
            generator: {
              // 输出图片名称
              // [hash:10] hash值取前10位
              filename: 'static/images/[hash:10][ext][query]'
            }
          },
          {
            test: /\.(ttf|woff2?|map3|map4)$/,
            type: 'asset/resource',
            generator: {
              // 输出名称
              filename: 'static/media/[hash:10][ext][query]'
            }
          },
          {
            test: /\.m?js$/,
            // 排除node_modules中的js文件（这些文件不处理）
            // exclude: /(node_modules|bower_components)/,
            // 只处理src下的文件，其他文件不处理
            include: path.resolve(__dirname, "../src"),
            loader: "babel-loader",
            // use: {
            //   loader: 'babel-loader',
            //   options: {
            //     presets: ['@babel/preset-env']
            //   }
            // }
            options: {
              cacheDirectory: true, // 开启babel编译缓存
              cacheCompression: false, // 缓存文件不要压缩
            },
          }
        ]
      }

    ]
  },
  // 插件
  plugins: [
    // plugins的配置
    new ESLintPlugin({
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules",
      cache: true, // 开启缓存
      // 缓存目录
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
    }),
    new HtmlWebpackPlugin({
      // 模板：以"public/index.html"文件创建新的html文件
      // 新的html文件特点：
      // (1)结构和原来一致
      // (2)自动引入打包输出的资源
      template: path.resolve(__dirname, "../public/index.html"),
    })
  ],
  // 开发服务器： 不会输出资源，在内存中编译打包的
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    hot: true // 开启HMR（默认值）
  },
  // 模式
  mode: "development",
  devtool: "cheap-module-source-map",
}