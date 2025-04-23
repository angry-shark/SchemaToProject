const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const glob = require("glob");

/**
 * 动态构造 pageEntries 和 HTMLWebpackPluginList
 */
const entryEntries = {};
const htmlWebpackPluginList = [];

/**
 * 获取 app 下的所有入口文件 （entry.xxx.js）
 */
const entryList = path.resolve(process.cwd(), "./app/pages/**/entry.*.js");
glob.sync(entryList).forEach((entry) => {
  //获取文件名
  const entryName = path.basename(entry, path.extname(entry));
  //构造entry
  entryEntries[entryName] = entry;
  //构造最终渲染的文件
  htmlWebpackPluginList.push(
    // html-webpack-plugin 辅助注入打包后的 bundle 文件到 tpl 中
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), `./app/view/entry.tpl`), //模板文件
      filename: path.resolve(
        process.cwd(),
        "./app/public/dist/",
        `${entryName}.tpl`
      ), //最终产物输出路径
      chunks: [entryName], //需要注入的js文件
    })
  );
});

/**
 * webpack 基础配置
 */
module.exports = {
  //入口配置
  entry: entryEntries,
  //模块解析配置（决定了要加载哪些模块，已经用什么方式加载）
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader",
        },
      },
      {
        test: /\.js$/,
        include: [
          //only include the files in the app/pages directory will use the babel-loader, improve bundle speed
          path.resolve(process.cwd(), "./app/pages/"),
        ],
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jpe?g|gif)(\?.+)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 300,
            esModule: false,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
          },
        ],
      },
      {
        //处理字体图标
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: "file-loader",
        },
      },
    ],
  },
  //产物输出路径, dev & prod 配置不一样的
  output: {
    filename: "js/[name]_[chunkhash:8].bundle.js", //打包后的文件名
    path: path.join(process.cwd(), `./app/public/dist/prod`), //打包后的文件存放路径
    publicPath: "/dist/prod/", //打包后的文件在浏览器中访问的路径
    crossOriginLoading: "anonymous", //是否开启跨域请求
  },
  //配置模块解析的具体行为（定义webpack 在打包时，如何找到解析模块的具体路径）
  resolve: {
    extensions: [".js", ".vue", ".json", ".less", "css"], //后缀名
    alias: {
      $pages: path.resolve(process.cwd(), "./app/pages"), //别名
      $common: path.resolve(process.cwd(), "./app/pages/common"), //别名
      $widgets: path.resolve(process.cwd(), "./app/pages/widgets"), //别名
      $store: path.resolve(process.cwd(), "./app/pages/store"), //别名
    },
  },
  //配置webpack的插件
  plugins: [
    //处理 .vue 文件，这个插件是必须的
    //它会把定义module的rules复制并应用到.vue文件中
    //eg。 有一个 /\.js$/ 的规则,应用到 .vue 文件中的script标签中
    new VueLoaderPlugin(),
    // 把第三方库暴露到全局变量中
    new webpack.ProvidePlugin({
      Vue: "vue",
    }),
    //定义全局变量
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: "true", //开启 vue3 的解析options api
      __VUE_PROD_DEVTOOLS__: "false", //关闭 vue3 的开发者工具
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false", //禁用生产环境的水合不匹配警告
    }),
    //构造最终渲染页面的html page1
    ...htmlWebpackPluginList,
  ],
  //配置打包输出优化（代码分割、模块合并，缓存，treeshaking，压缩等优化策略）
  optimization: {
    /**
     * 分包规则：
     * 把 js 分成 3 种类型
     * 1. vendor：第三方库，基本不改动，除非升级依赖
     * 2. common：业务组件中的公共模块，可能会改动，但改动频率低
     * 3. entry.{page}: 每个页面里自己的逻辑，经常会改动且不会复用到其他 entry 中
     * goal：把改动和引用频率不同的 js 区分出来，充分利用到浏览器的缓存效果
     */
    splitChunks: {
      chunks: "all", //对同步和异步的模块都进行分割
      maxAsyncRequests: 10, //每次异步加载的最大并行请求数
      maxInitialRequests: 10, //入口点的最大并行请求数
      cacheGroups: {
        //分包的配置，分哪些包 & 怎么划分
        vendor: {
          //打包第三方依赖库
          test: /[\\/]node_modules[\\/]/, //对于node_modules 的文件都认为是第三方库
          name: "vendor", //分包的 模块名称
          priority: 20, //优先级，数字越大，优先级越高
          enforce: true, //强制执行
          reuseExistingChunk: true, //复用已有的公共 chunk
        },
        common: {
          //公共模块（跨entry）
          name: "common", //模块名称
          minChunks: 2, //被两（2）个地方引用 即被认为是公共模块
          minSize: 1, //最小分割文件大小（1 byte）
          priority: 10, //优先级
          reuseExistingChunk: true, //复用已有的公共 chunk
        },
      },
    },
    //将webpack自己的运行时代码，打包到runtime
    runtimeChunk: true,
  },
};
