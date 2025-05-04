module.exports = (app) => {
  const BaseService = require("./base")(app);

  return class BusinessService extends BaseService {
    async getList(ctx) {}
  };
};
