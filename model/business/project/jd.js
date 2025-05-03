module.exports = {
  name: "京东",
  desc: "京东电商系统",
  homePage: "/todo?proj_key=jd&key=product",
  menu: [
    {
      key: "shop-setting",
      name: "店铺设置",
      menuType: "group",
      subMenu: [
        {
          key: "info-setting",
          name: "店铺信息设置",
          menuType: "module",
          moduleType: "custom",
          customConfig: {
            path: "/todo",
          },
        },
        {
            key: "quality-setting",
            name: "店铺资质",
            menuType: "module",
            moduleType: "iframe",
            iframeConfig: {
              path: "https://www.baidu.com",
            },
          },
      ], 
    },
  ],
};
