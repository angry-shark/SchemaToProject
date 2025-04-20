const Koa = require("koa");
const path = require("path");
const { sep } = path;

const env =require("./env")

const middlewareLoader = require("./loader/middleware");
const routerSchemaLoader = require("./loader/router-schema");
const routerLoader = require("./loader/router");
const controllerLoader = require("./loader/controller");
const serviceLoader = require("./loader/service");
const configLoader = require("./loader/config");
const extendLoader = require("./loader/extend");
const { request } = require("http");

module.exports = {
  /**
   * 启动项目
   * @param {项目配置} options
   * options = {
   *   name//项目名称
   *   homepage //项目首页
   * }
   */
  start(options = {}) {
    const app = new Koa();

    app.options = options || {};

    app.baseDir = process.cwd();
    console.log(`当前项目目录：${app.baseDir}`);
    app.businessPath = path.resolve(app.baseDir, `.${sep}app`);
    console.log(`当前业务目录：${app.businessPath}`);

    app.env = env();
    console.log(`当前环境：${app.env.get()}`);

    //加载middleware
    middlewareLoader(app);
    console.log("加载中间件完成");
    //加载路由schema
    routerSchemaLoader(app);
    console.log("加载路由schema完成");
    //加载controller
    controllerLoader(app);
    console.log("加载controller完成");
    //加载 service
    serviceLoader(app);
    console.log("加载service完成");
    //加载config
    configLoader(app);
    console.log("加载config完成");
    //加载extend
    extendLoader(app);
    console.log("加载extend完成");

    //注册全局中间件
    try{
      request(`${app.businessPath}${sep}middleware.js`)(app)
      console.log("注册全局中间件完成");
    }catch(e){
      console.error(`注册全局中间件失败：${e}`);
    }

    //加载&注册路由
    routerLoader(app);
    console.log("加载&注册路由完成");

    //


    //启动服务
    try{
      const port = process.env.PORT || 3000;
      const host = process.env.HOST || "0.0.0.0"
      app.listen(port, host, () => {
        console.log(`服务启动成功，访问地址： http://${host}:${port}`);
      });
    }catch(e){
      console.error(`服务启动失败：${e}`);
    }
  },
};
