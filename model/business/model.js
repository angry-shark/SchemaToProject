module.exports = {
  module: "dashboard",
  name: "电商系统",
  menu: [
    {
      key: "product",
      name: "商品管理",
      menuType: "module",
      module: "schema",
      schemaConfig: {
        api: "/api/proj/product",
        schema: {
          type: "object",
          properties: {
            product_id: {
              type: "string",
              label: "商品ID",
              tableOption: {
                width: 300,
                "show-overflow-tooltip": true,
              },
              searchOption: {
                comType: "input",
              },
            },
            product_name: {
              type: "string",
              label: "商品名称",
              tableOption: {
                width: 200,
              },
              searchOption: {
                comType: "dynamicSelect",
                api: "/api/proj/product_enum/list",
              },
            },
            price: {
              type: "number",
              label: "价格",
              tableOption: {
                width: 200,
              },
              searchOption: {
                comType: "select",
                enumList: [
                  {
                    label: "全部",
                    value: -999,
                  },
                  {
                    label: "$39.9",
                    value: 39.9,
                  },
                  {
                    label: "$199",
                    value: 199,
                  },
                  {
                    label: "$699",
                    value: 699,
                  },
                ],
              },
            },
            inventory: {
              type: "number",
              label: "库存",
              tableOption: {
                width: 200,
              },
              searchOption: {
                comType: "input",
              },
            },
            create_time: {
              type: "string",
              label: "创建时间",
              tableOption: {},
              searchOption:{
                comType:'dateRange'
              }
            },
          },
        },
        tableConfig: {
          headerButtons: [
            {
              label: "新增商品",
              eventKey: "showComponent",
              eventOption:{
                comName:'createForm'
              },
              type: "primary",
              plain: true,
            },
          ],
          rowButtons: [
            {
              label: "修改",
              eventKey: "showComponent",
              type: "warning",
            },
            {
              label: "删除",
              eventKey: "remove",
              eventOption: {
                params: {
                  product_id: "schema::product_id",
                },
              },
              type: "danger",
            },
          ],
        },
        componentConfig:{
          createForm: {
            title: "", //表单标题
            saveBtnText: "", //保存按钮文案
          },
        }
      },
    },
    {
      key: "order",
      name: "订单管理",
      menuType: "module",
      moduleType: "custom",
      customConfig: {
        path: "/todo",
      },
    },
    {
      key: "client",
      name: "客户管理",
      menuType: "module",
      moduleType: "custom",
      customConfig: {
        path: "/todo",
      },
    },
  ],
};
