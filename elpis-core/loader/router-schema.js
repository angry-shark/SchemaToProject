const path = require("path");
const glob = require("glob");

/**
 * router-schema loader
 * @param {object} app koa 示例
 *
 * 通过 ‘json-schema & ajv’ 对api规则进行约束，配合 api-params-verify 中间件使用
 * 
 * app/router-schema/**.js
 * 输出：
 * app.routerSchema = {
 * `${api1}`: ${jsonSchema1},
 * `${api2}`: ${jsonSchema2},
 * } 
 */
module.exports = (app) => {
    // 读取 app/router-schema/**/**.js 目录下的所有文件
    const routerSchemaPath = path.resolve(app.businessPath, `.${path.sep}router-schema`);
    const fileList = glob.sync(path.resolve(routerSchemaPath, `.${path.sep}**${path.sep}*.js`));

    //注册所有router-schema， 使得可以通过 app.routerSchema.${api} 访问
    let routerSchema = {};

    fileList.forEach((file) => {
        routerSchema = {
            ...routerSchema,
            ...require(path.resolve(file))
        }
    })


    app.routerSchema = routerSchema;
};
