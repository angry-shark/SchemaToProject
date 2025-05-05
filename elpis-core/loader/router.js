const KoaRouter = require("koa-router");
const path = require("path");
const glob = require("glob");
const { sep } = path;

/**
 * router loader
 * @param {object} app koa instance
 *
 * 解析所有 app/router/ 所有 js 文件，加载到 KoaRouter 下
 */
module.exports = (app) => {
  //找到router目录
  const routerPath = path.resolve(app.businessPath, `.${sep}router`);

  //实例化 KoaRouter
  const router = new KoaRouter();

  //注册所有路由
  const fileList = glob.sync(path.resolve(routerPath, `.${sep}**${sep}*.js`));
  fileList.forEach((file) => {
    // module.exports = (app,router) => {
    //  router.get('xxx', async (ctx, next) => {})
    // }
    require(path.resolve(file))(app, router);
  });

  //路由兜底（健壮性）
  router.get("*", async (ctx, next) => {
    ctx.status = 302; // temp redirect
    ctx.redirect(app?.options?.homePage ?? "/");
  });

  //路由注册到 app 上
  app.use(router.routes());
  app.use(router.allowedMethods());
};
