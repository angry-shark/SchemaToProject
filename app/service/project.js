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
      return modelList;
    }

    /**
     * 根据 proj_key 获取对应模型下的 proj_list（若无proj_key, 全量获取）
     * @param {*} ctx
     */
    async getList({ projKey }) {
      return modelList.reduce((prev,cur) => {
        const newPrev = [...prev]
        const {project} = cur

        if(!projKey || !project[projKey]){
          return;
        }

        for(const pKey in project){
          newPrev.push(project[pKey])
        }


        return newPrev;
      },[])
    }
  };
};
