const baseConfig = require("./webpack.base");
const merge = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");

// devServer 配置
const DEV_SERVER_CONFIG = {
  HOST: "127.0.0.1",
  PORT: 3002,
  HMR_PATH: "__webpack_hmr", //官方要求的
  TIMEOUT: 20000,
};

//开发阶段的 entry 配置需要加入hmr
Object.keys(baseConfig.entry).forEach((v) => {
  if (v !== "vendor") {
    //第三方包不作为 hmr 入口
    const hmrPath = `http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/${DEV_SERVER_CONFIG.HMR_PATH}&timeout=${DEV_SERVER_CONFIG.TIMEOUT}`;
    baseConfig.entry[v] = [
      //主入口文件
      baseConfig.entry[v],
      // hmr 更新入口， 官方指定的 hmr 路径
      `webpack-hot-middleware/client?path=${hmrPath}`,
    ];
  }
});

const webpackDevConfig = merge.smart(baseConfig, {
  //指定 mode
  mode: "development",
  //source-map,呈现代码映射关系
  devtool:'eval-cheap-module-source-map',
  //开发阶段的output
  output: {
    filename: "js/[name]_[chunkhash:8].bundle.js", //打包后的文件名
    path: path.resolve(process.cwd(), `./app/public/dist/dev`), //打包后的文件存放路径
    publicPath: `http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/public/dist/dev/`, //外部资源公共路径
    globalObject:'this'
  },

  //开发阶段的插件
  plugins:[
    //impl Hot Module replacement,
    //can support application replace module when application is running
    new webpack.HotModuleReplacementPlugin({
        multiStep: false
    })
  ]
});

module.exports = {
  // webpack config
  webpackDevConfig,
  // hmr config
  DEV_SERVER_CONFIG,
};
