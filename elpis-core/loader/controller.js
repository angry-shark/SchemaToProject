const path = require("path");
const glob = require("glob");
const {sep} = path

/**
 * controller loader
 * @param {object} app koa instance
 * 加载所有controller， 可通过‘app.controller.${目录}.${文件}’访问
 * eg:
 * app/controller
 *  ├── custom-module
 *  │   ├── custom-controller.js
 * 
 * => app.controller.customModule.customController
 */
module.exports = (app) => {
    //读取 app/controller/**/**.js 目录下的所有文件
    const controllerPath = path.resolve(app.businessPath, `.${sep}controller`);
    const fileList = glob.sync(path.resolve(controllerPath, `.${sep}**${sep}*.js`));

    //遍历文件目录，把内容加载到 app.controller 下
    const controller = {}
    fileList.forEach((file) => {
        // 提取文件名
        let name = path.resolve(file);
        // 截取路径
        name = name.substring(name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length, name.lastIndexOf('.'));
        // 改为驼峰命名法
        name = name.replace(/[_-][a-z]/ig, (s) => {
            return s.substring(1).toUpperCase();
        })
        // 挂载到 controllers 对象中
        let tempController = controller;
        const names = name.split(sep);
        for(let i = 0; i < names.length; i++) {
            const n = names[i];
            if (!tempController[n]) {
                tempController[n] = {};
            }
            if (i === names.length - 1) {
                const ControllerModule= require(path.resolve(file))(app);
                tempController[n] = new ControllerModule();
            } else {
                tempController = tempController[n];
            }
        }
    })

    app.controller = controller;
}