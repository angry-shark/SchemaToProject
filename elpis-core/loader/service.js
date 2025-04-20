const path = require("path");
const glob = require("glob");
const { sep } = path;

/**
 * service loader
 * @param {object} app koa instance
 * 加载所有service， 可通过‘app.service.${目录}.${文件}’访问
 * eg:
 * app/service
 *  ├── custom-module
 *  │   ├── custom-service.js
 *
 * => app.service.customModule.customService
 */
module.exports = (app) => {
  //读取 app/service/**/**.js 目录下的所有文件
  const servicePath = path.resolve(app.businessPath, `.${sep}service`);
  const fileList = glob.sync(path.resolve(servicePath, `.${sep}**${sep}*.js`));

  //遍历文件目录，把内容加载到 app.service 下
  const service = {};
  fileList.forEach((file) => {
    // 提取文件名
    let name = path.resolve(file);
    // 截取路径
    name = name.substring(
      name.lastIndexOf(`service${sep}`) + `service${sep}`.length,
      name.lastIndexOf(".")
    );
    // 改为驼峰命名法
    name = name.replace(/[_-][a-z]/gi, (s) => {
      return s.substring(1).toUpperCase();
    });
    // 挂载到 services 对象中
    let tempService = service;
    const names = name.split(sep);
    for (let i = 0; i < names.length; i++) {
      const n = names[i];
      if (!tempService[n]) {
        tempService[n] = {};
      }
      if (i === names.length - 1) {
        const ServiceModule = require(path.resolve(file))(app);
        tempService[n] = new ServiceModule();
      } else {
        tempService = tempService[n];
      }
    }
  });

  app.service = service;
};
