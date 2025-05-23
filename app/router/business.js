module.exports = (app, router) => {
  const { business: businessController } = app.controller;

  router.get(
    "/api/proj/product/list",
    businessController.getList.bind(businessController)
  );

  router.get(
    "/api/proj/product_enum/list",
    businessController.getProductEnumList.bind(businessController)
  );

  router.get(
    "/api/proj/product",
    businessController.getProduct.bind(businessController)
  );

  router.put(
    "/api/proj/product",
    businessController.modifyProduct.bind(businessController)
  );

  router.post(
    "/api/proj/product",
    businessController.create.bind(businessController)
  );

  router.delete(
    "/api/proj/product",
    businessController.remove.bind(businessController)
  );
};
