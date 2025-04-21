const Ajv = require("ajv");
const ajv = new Ajv();
/**
 * api 参数校验
 * @param {} app
 * @returns
 */
module.exports = (app) => {
  const $schema = "http://json-schema.org/draft-07/schema#";
  return async (ctx, next) => {
    //只对api请求做签名校验
    if (ctx.path.indexOf("/api") < 0) {
      return await next();
    }

    //获取请求参数
    const { query, body, headers } = ctx.request;
    const { params, path, method } = ctx;

    //日志记录
    app.logger.info(`[${method} ${path}] body:${JSON.stringify(body)}`);
    app.logger.info(`[${method} ${path}] query:${JSON.stringify(query)}`);
    app.logger.info(`[${method} ${path}] params:${JSON.stringify(params)}`);
    app.logger.info(`[${method} ${path}] headers:${JSON.stringify(headers)}`);

    const schema = app.routerSchema[path]?.[method.toLowerCase()];

    if (!schema) {
      return await next();
    }

    let valid = true;

    // ajv 校验器
    let validate;

    //校验headers
    if (valid && headers && schema.headers) {
      schema.headers.$schema = $schema; // 兼容ajv
      validate = ajv.compile(schema.headers); //构造校验器
      valid = validate(headers); //开始校验
    }

    //校验query
    if (valid && query && schema.query) {
      schema.query.$schema = $schema; // 兼容ajv
      validate = ajv.compile(schema.query); //构造校验器
      valid = validate(query); //开始校验
    }

    //校验params
    if (valid && params && schema.params) {
      schema.params.$schema = $schema; // 兼容ajv
      validate = ajv.compile(schema.params); //构造校验器
      valid = validate(params); //开始校验
      console.log("params校验结果", valid);
    }

    //校验body
    if (valid && body && schema.body) {
      schema.body.$schema = $schema; // 兼容ajv
      validate = ajv.compile(schema.body); //构造校验器
      valid = validate(body); //开始校验
    }

    if (!valid) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        message: `参数校验失败: ${ajv.errorsText(validate.errors)}`,
        code: 442,
      };
      return;
    }

    await next();
  };
};
