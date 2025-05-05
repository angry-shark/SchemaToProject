/**
 * 运行时错误处理，兜底所有异常
 * @param {} app koa 实例
 */
module.exports = (app) => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      // 处理异常
      const { status, message, detail } = err;

      app.logger.info(JSON.stringify(err));
      app.logger.error("[-- exception --]:", err);
      app.logger.error("[-- exception --]:", status, message, detail);

      if (message && message.indexOf("template not found") > -1) {
        // 页面重定向
        /**
         * 如果用301，那么这个路径会被浏览器缓存，只要缓存不清除，就会一直重定向到这个页面。哪怕该页面在未来上线了，用户也会失去访问这个页面的机会。
         * 如果用302，浏览器会重新请求这个页面，用户就可以访问到这个页面。
         */
        ctx.status = 302; //临时重定向
        ctx.redirect(`${app.options?.homePage}`);
        return;
      }

      const resBody = {
        success: false,
        message: "网络异常， 稍后重试",
        code: 50000,
      };
      ctx.status = 200;
      ctx.body = resBody;
    }
  };
};
