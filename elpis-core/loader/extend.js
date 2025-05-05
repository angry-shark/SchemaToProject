const path = require("path");
const glob = require("glob");
const {sep} = path

/**
 * extend loader
 * @param {object} app koa instance
 * 加载所有extend， 可通过‘app.extends.${目录}.${文件}’访问
 * eg:
 * app/extend
 *  ├── custom-extend.js
 * 
 * => app.extend.customExtend
 */
module.exports = (app) => {
    //读取 app/extend/**/**.js 目录下的所有文件
    const extendPath = path.resolve(app.businessPath, `.${sep}extend`);
    const fileList = glob.sync(path.resolve(extendPath, `.${sep}**${sep}*.js`));

    //遍历文件目录，把内容加载到 app.extend 下
    fileList.forEach((file) => {
        // 提取文件名
        let name = path.resolve(file);
        // 截取路径
        name = name.substring(name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length, name.lastIndexOf('.'));
        // 改为驼峰命名法
        name = name.replace(/[_-][a-z]/ig, (s) => {
            return s.substring(1).toUpperCase();
        })

        // 过滤 app 已存在的 key
        for(const key in app){
            if(key === name){
                console.log(`extend ${name} 已存在， 请修改文件名`);
                return;
            }

            //挂载 extend 到 app 上
            app[name] = require(path.resolve(file))(app);
        }
    
    })
}