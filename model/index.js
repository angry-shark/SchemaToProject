const glob = require("glob");
const path = require("path");
const { sep } = path;
const _ = require("lodash");

// project 继承 model
function projectExtendModel(model, project) {
  return _.mergeWith({}, model, project, (modelValue, projectValue) => {
    //针对数组的处理方法
    if ([modelValue, projectValue].every((item) => Array.isArray(item))) {
      let result = [];

      //因为project 要继承 model，所以会有以下几种情况
      /**
       * 1. project has key, but model not => should add
       * 2. project and model both has the key => prefer project‘s value,should modify
       * 3. project does not have the key, but model has => should retain
       */

      //case 2，modify
      for (let i = 0; i < modelValue.length; i++) {
        const modelItem = modelValue[i];
        const projectItem = projectValue.find(
          (proj) => proj.key === modelItem.key
        );
        /*
         * proj & model both have same key, should 递归调用 projectExtendModel 方法
         * overwrite
         */
        result.push(
          projectItem ? projectExtendModel(modelItem, projectItem) : modelItem
        );
      }

      //case 1， add
      for (let i = 0; i < projectValue.length; i++) {
        const projectItem = projectValue[i];
        const modelItem = modelValue.find(
          (modelItem) => modelItem.key === projectItem.key
        );
        /*
         * proj has the key, but model doesn't have, 
            should 递归调用 projectExtendModel 方法
         * add
         */
        if (!modelItem) {
          result.push(projectItem);
        }
      }

      return result;
    }
  });
}

/**
 * 解析 model 配置，并返回组织且继承后的结构数据
 * [{
 *  model:${model}
 *  project:{
 *    proj1:${proj1},
 *    proj2:${proj2}
 *  }
 * },....]
 * @param {*} app
 */
module.exports = (app) => {
  const modelList = [];

  //遍历当前文件夹，构造模型数据结构，挂载到 modelList 上
  const modelPath = path.resolve(app.baseDir, `.${sep}/model`);
  const fileList = glob.sync(path.resolve(modelPath, `.${sep}**${sep}**.js`));
  fileList.forEach((file) => {
    if (file.indexOf("index.js") > -1) {
      return;
    }

    //区分配置类型 model/project
    const type = file.indexOf(`${sep}project${sep}`) > -1 ? "project" : "model";

    if (type === "project") {
      const modelKey = file.match(/\/model\/(.*?)\/project/)?.[1];
      const projectKey = file.match(/\/project\/(.*?)\.js/)?.[1];

      let modelItem = modelList.find((item) => {
        return item.model?.key === modelKey;
      });

      if (!modelItem) {
        //初始化modelItem
        modelItem = {};
        modelList.push(modelItem);
      }

      if (!modelItem.project) {
        //初始化project数据结构
        modelItem.project = {};
      }

      modelItem.project[projectKey] = require(file);
      modelItem.project[projectKey].key = projectKey; //注入proj key
      modelItem.project[projectKey].modelKey = modelKey; //注入model key
    }

    if (type === "model") {
      const modelKey = file.match(/\/model\/(.*?)\/model.js/)?.[1];
      let modelItem = modelList.find((item) => {
        return item.model?.key === modelKey;
      });

      if (!modelItem) {
        //初始化modelItem
        modelItem = {};
        modelList.push(modelItem);
      }

      modelItem.model = require(path.resolve(file));
      modelItem.model.key = modelKey; // 注入 model key
    }
  });

  //进一步整理数据： project 继承 相应的 model
  modelList.forEach((item) => {
    const { model, project } = item;

    for (const key in project) {
      project[key] = projectExtendModel(model, project[key]);
    }
  });

  return modelList;
};
