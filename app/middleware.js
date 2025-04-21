const path = require("path");

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
};
