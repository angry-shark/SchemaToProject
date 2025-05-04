module.exports = (app) => {
  const BaseController = require("./base")(app);
  return class BusinessController extends BaseController {
    async getList(ctx) {
      const { page, size } = ctx.request.query;

      //获取proj_key
      //根据不同的proj_key, 做不一样的数据提取

      this.success(
        ctx,
        [
          {
            product_id: 1,
            product_name: `${ctx.projKey} 大前端面试宝典`,
            price: 39.9,
            inventory: 99999,
            create_time: "2025-05-03 23:39:00",
          },
          {
            product_id: 2,
            product_name: `${ctx.projKey} 前端求职指导`,
            price: 199,
            inventory: 99999,
            create_time: "2025-05-03 23:39:00",
          },
          {
            product_id: 3,
            product_name: `${ctx.projKey} 前端全站事件`,
            price: 699,
            inventory: 99999,
            create_time: "2025-05-03 23:39:00",
          },
        ],
        {
          page: Number(page),
          size: Number(size),
          total: 3,
        }
      );
    }

    async remove(ctx) {
      const { product_id: productId } = ctx.request.body;
      this.success(ctx, {
        projKey: ctx.projKey,
        product_id: productId,
      });
    }
  };
};
