const path = require("path");
const glob = require("glob");
const {sep} = path

/**
 * middleware loader
 * @param {object} app koa instance
 * 加载所有middleware， 可通过‘app.middlewares.${目录}.${文件}’访问
 * eg:
 * app/middleware
 *  ├── custom-module
 *  │   ├── custom-middleware.js
 * 
 * => app.middlewares.customModule.customMiddleware
 */
module.exports = (app) => {
    //读取 app/middleware/**/**.js 目录下的所有文件
    const middlewarePath = path.resolve(app.businessPath, `.${sep}middleware`);
    const fileList = glob.sync(path.resolve(middlewarePath, `.${sep}**${sep}*.js`));

    //遍历文件目录，把内容加载到 app.middleware 下
    const middlewares = {}
    fileList.forEach((file) => {
        // 提取文件名
        let name = path.resolve(file);
        // 截取路径
        name = name.substring(name.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length, name.lastIndexOf('.'));
        // 改为驼峰命名法
        name = name.replace(/[_-][a-z]/ig, (s) => {
            return s.substring(1).toUpperCase();
        })
        // 挂载到 middlewares 对象中
        let tempMiddleware = middlewares;
        const names = name.split(sep);
        for(let i = 0; i < names.length; i++) {
            const n = names[i];
            if (!tempMiddleware[n]) {
                tempMiddleware[n] = {};
            }
            if (i === names.length - 1) {
                tempMiddleware[n] = require(path.resolve(file))(app);
            } else {
                tempMiddleware = tempMiddleware[n];
            }
        }
    })

    app.middlewares = middlewares;
}