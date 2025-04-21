const path = require("path");


/**
 * 从下往上 = 从外到内
 * @param {} app 
 */
module.exports = (app) => {
  // 静态资源中间件, 配置静态资源根目录
  const koaStatic = require("koa-static");
  app.use(koaStatic(path.resolve(process.cwd(), "./app/public")));

  // 模板渲染引擎
  const koaNunjucks = require("koa-nunjucks-2");
  app.use(
    koaNunjucks({
      ext: "tpl",
      path: path.resolve(process.cwd(), "./app/public"),
      nunjucksConfig: {
        noCache: true,
        trimBlocks: true,
      },
    })
  );

  //引入 ctx body 解析中间件
  app.use(require("koa-bodyparser")({
    formLimit:'1000mb',
    enableTypes: ['json', 'form', 'text'],
  }));


  //引入异常捕获中间件
  const errorHandle = app.middlewares.errorHandle
  app.use(errorHandle);

  //引入api签名合法性校验中间件
  const apiSignVerify = app.middlewares.apiSignVerify;
  app.use(apiSignVerify);
};
