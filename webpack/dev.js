const webpack = require("webpack");
const express = require("express");
const path = require("path");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");
const consoler = require("consoler");

const { webpackDevConfig, DEV_SERVER_CONFIG } = require("./config/webpack.dev");

const app = express();

const compiler = webpack(webpackDevConfig);

//指定静态文件目录
app.use(express.static(path.resolve(__dirname, "../public/dist")));
//引入devMiddleware，watch file change
app.use(
  devMiddleware(compiler, {
    //落地文件
    writeToDisk: (filePath) => {
      return filePath.endsWith(".tpl");
    },
    //资源路径
    publicPath: webpackDevConfig.output.publicPath,
    //headers 配置解决跨域
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Assess-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Assess-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },

    stats: {
      colors: true,
    },
  })
);
//引入hotMiddleware， impl hot update commutation
app.use(hotMiddleware(compiler, {
    path:`/${DEV_SERVER_CONFIG.HMR_PATH}`,
    log: () => {}
}));

consoler.info("--- info wait webpack first boot complete tip ---");
//boot dev server
const port = DEV_SERVER_CONFIG.PORT;
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
