module.exports = (app) =>
  class BaseController {
    /**
     * controller基类
     * @param {object} ctx 上下文
     * 统一收拢 controller 的一些公共方法
     */
    constructor(ctx) {
      this.app = app;
      this.config = app.config;
    }

    /**
     * API 处理成功时统一返回结构
     * @params {object} ctx 上下文
     * @params {object} data 返回数据
     * @params {object} metadata 返回元数据
     */
    success(ctx, data, metadata) {
      ctx.status = 200;
      ctx.body = {
        success: true,
        data,
        metadata,
      };
    }

    /**
     * API 处理失败时统一返回结构
     * @params {object} ctx 上下文
     * @params {object} message 错误信息
     * @params {object} code 错误码
     */
    fail(ctx, code, message) {
      ctx.body = {
        success: false,
        code,
        message,
      };
    }
  };
