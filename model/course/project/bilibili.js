module.exports = {
  name: "b站课堂",
  desc: "b站课程管理系统",
  homePage: "",
  menu: [
    {
        key:'video',
        name:'视频管理(b站)'
    },
    {
      key: "traffic",
      name: "课程资料",
      menuType: "module",
      moduleType: " sider",
      siderConfig: {
        menu: [
          {
            key: "pdf",
            name: "PDF",
            menuType: "module",
            moduleType: "custom",
            customConfig: {
              path: "/todo",
            },
          },
          {
            key: "excel",
            name: "Excel",
            menuType: "module",
            moduleType: "custom",
            customConfig: {
              path: "/todo",
            },
          },
          {
            key: "ppt",
            name: "PPT",
            menuType: "module",
            moduleType: "custom",
            customConfig: {
              path: "/todo",
            },
          },
        ],
      },
    },
  ],
};
