const baseConfig = require("./webpack.base");
const merge = require("webpack-merge");
const path = require("path");
const os = require("os");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CSSMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackInjectAttributesPlugin = require("html-webpack-inject-attributes-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

console.log(`-- current device has ${os.cpus().length} cpus --`);

const webpackProdConfig = merge.smart(baseConfig, {
  //指定 mode
  mode: "production",
  //生产环境的 output 配置
  output: {
    filename: "js/[name]_[chunkhash:8].bundle.js", //打包后的文件名
    path: path.join(process.cwd(), "./app/public/dist/prod"), //打包后的文件存放路径
    publicPath: "/dist/prod/", //打包后的文件在浏览器中访问的路径
    crossOriginLoading: "anonymous", //是否开启跨域请求
  },
  //多线程打包 & 压缩 css
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "thread-loader",
            options: {
              workers: os.cpus().length, //根据cpus 核心数设置线程数目
              workerParallelJobs: 50, //每个线程并行的任务数量
              poolTimeout: 2000, //线程空闲的超时时间
            },
          },
          "css-loader",
        ],
      },
      {
        test: /\.js$/,
        include: [
          //only include the files in the app/pages directory will use the babel-loader, improve bundle speed
          path.resolve(process.cwd(), "./app/pages"),
        ],
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: os.cpus().length, //根据cpus 核心数设置线程数目
              workerParallelJobs: 50, //每个线程并行的任务数量
              poolTimeout: 2000, //线程空闲的超时时间
            },
          },
          "babel-loader",
        ],
      },
    ],
  },
  performance: {
    hints: false, //webpack 不会出现大量的hint信息， 默认为 warning
  },
  plugins: [
    //每次构建前清空上一次的构建结果 in public/dist
    new CleanWebpackPlugin(["public/dist"], {
      root: path.resolve(process.cwd(), "./app/"),
      exclude: [],
      verbose: true,
      dry: false,
    }),
    //提取 css 的公共方案，有效利用缓存（非 公共部分 的css 使用 inline）
    new MiniCssExtractPlugin({
      filename: "css/[name]_[contenthash:8].bundle.css",
      chunkFilename: "css/[name]_[contenthash:8].bundle.css",
    }),
    //优化并压缩 css 资源
    new CSSMinimizerPlugin(),
    //浏览器请求资源时不发送 用户的身份凭证
    new HtmlWebpackInjectAttributesPlugin({
      crossorigin: " anonymous",
    }),
  ],
  optimization: {
    //使用 TerserPlugin 的并非和缓存，提升压缩阶段的性能
    //清除代码中的 console.log
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        cache: true, //启用缓存来加速构建过程
        parallel: true, //利用多核cpu优势，并行运行，加速压缩速度
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
      }),
    ],
  },
});

module.exports = webpackProdConfig;
