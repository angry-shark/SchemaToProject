module.exports = (app) => {
  const BaseService = require("./base")(app);
  const modelList = require("../../model/index.js")(app);

  return class ProjectService extends BaseService {
    /**
     * 获取所有模型与proj的结构化数据
     * @param {object} ctx 上下文
     * @returns
     */
    async getModelList(ctx) {
      return modelList
    }
  };
};
