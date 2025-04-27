module.exports = {
  name: "淘宝",
  desc: "淘宝电商系统",
  homePage: "",
  menu: [
    {
        key:'order',
        moduleType:'iframe',
        iframeConfig:{
            path:'https://www.baidu.com'
        }
    },
    {
      key: "operating",
      name: "运营活动",
      menuType: "module",
      moduleType: "sider",
      sideConfig: {
        menu: [
          {
            key: "coupon",
            name: "优惠券",
            menuType: "module",
            customConfig: {
              path: "/todo",
            },
          },
          {
            key: "limited",
            name: "限量购",
            menuType: "module",
            customConfig: {
              path: "/todo",
            },
          },
          {
            key: "festival",
            name: "节日活动",
            menuType: "module",
            customConfig: {
              path: "/todo",
            },
          },
        ],
      },
    },
  ],
};
