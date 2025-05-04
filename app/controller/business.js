module.exports = (app) => {
  const BaseController = require("./base")(app);
  return class BusinessController extends BaseController {
    async getList(ctx) {
      const { product_name: productName, page, size } = ctx.request.query;

      let productList = [
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
      ];

      if (productName) {
        productList = productList.filter((product) => {
          return product.product_name.indexOf(productName) > -1;
        });
      }

      this.success(ctx, productList, {
        page: Number(page),
        size: Number(size),
        total: 3,
      });
    }

    async getProductEnumList(ctx) {
      this.success(
        ctx,
        [
          {
            label: `全部`,
            value: `全部`,
          },
          {
            label: `${ctx.projKey} 大前端面试宝典`,
            value: `${ctx.projKey} 大前端面试宝典`,
          },
          {
            label: `${ctx.projKey} 前端求职指导`,
            value: `${ctx.projKey} 前端求职指导`,
          },
          {
            label: `${ctx.projKey} 前端全站事件`,
            value: `${ctx.projKey} 前端全站事件`,
          },
        ]
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
