module.exports = (app) => {
  const BaseController = require("./base")(app);
  return class ProjectController extends BaseController {
    /**
     * 获取所有模型与proj的结构化数据
     * @param {object} ctx ctx上下文
     */
    async getModelList(ctx) {
      const { project: projectService } = app.service;
      const modelList = await projectService.getModelList();

      //过滤洗数据，构造返回结果，只返回需要的字段
      const dtoModelList = modelList.reduce((prev, item) => {
        const { model, project } = item;

        //构造model关键数据
        const { key, name, desc } = model;
        const dtoModel = { key, name, desc };

        //构造project关键数据
        const dtoProject = Object.entries(project).reduce((prev, cur) => {
          const [projKey, val] = cur;
          const { key, name, desc, homePage } = val;
          prev[projKey] = { key, name, desc, homePage };

          return prev;
        }, {});

        //构造返回结构
        prev.push({
          model: dtoModel,
          project: dtoProject,
        });

        return prev;
      }, []);

      this.success(ctx, dtoModelList);
    }

    /**
     * 根据 proj_key 获取对应模型下的 proj_list（若无proj_key, 全量获取）
     * @param {*} ctx
     */
    async getList(ctx) {
      const { proj_key: projKey } = ctx.request.query;

      const { project: projectService } = app.service;
      const projectList = await projectService.getList({ projKey });
      //构建关键数据list
      const dtoProjectList = projectList.map((proj) => {
        const { modelKey, key, name, desc, homePage } = proj;
        return { modelKey, key, name, desc, homePage };
      });
      this.success(ctx, dtoProjectList);
    }

    /**
     * 获取指定 proj_key 的项目配置
     */
    async getProject(ctx) {
      const { proj_key: projKey } = ctx.request.query;
      if (!projKey) {
        this.fail(ctx, "proj_key is required");
        return;
      }

      const { project: projectService } = app.service;
      const projectConf = await projectService.getProject({projKey});
      if (!projectConf) {
        this.fail(ctx, 50000, "proj_key not found");
        return;
      }


      this.success(ctx, projectConf);
    }
  };
};
