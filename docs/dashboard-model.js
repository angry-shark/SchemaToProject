module.exports = {
  mode: "dashboard", //模版类型，不同模版类型对应不一样的模版数据结构
  name: "", //名称
  desc: "", //描述
  icon: "", // icon
  homePage: "", // 首页（项目配置）
  //头部菜单
  menu: [
    {
      key: "", //菜单唯一描述
      name: "", //菜单名称
      menuType: "", //枚举值

      //当menuType为group时，可填
      subMenu: [
        {
          //可递归menuItem
        },
      ],

      //当 menuType 为 module 时，可填
      moduleType: "",

      //当 moduleType 为 sider 时，可填
      siderConfig: {
        menu: [
          {
            //可递归 menuItem (除了 moduleType === sider)
          },
        ],
      },

      //当 moduleType 为 iframe 时，可填
      iframeConfig: {
        path: "", // iframe 路径
      },

      //当 moduleType 为 custom 时，可填
      customConfig: {
        path: "", //  自定义路由路径
      },

      //当 moduleType 为 schema 时，可填
      schemaConfig: {
        api: "", //数据源 API （遵循RESTFUL）eg. /api/user
        schema: {
          //板块数据结构
          type: "object",
          properties: {
            key: {
              ...schema, //标准的schema
              type: "", //字段类型
              label: "", //字段的中文名
              // 字段在 table 中的相关配置
              tableOption: {
                ...elTableColumnConfig, //标准的 el-table-column 配置
                visible: true, //是否显示 true / false, 显式配置为 false 时不展示
                toFixed: 2, //小数点后保留几位
              },
              // 字段在 search-bar 中的相关配置
              searchOption: {
                ...elComponentConfig, //标准的 el-component 配置
                comType:'',//配置控件类型： input / select / ....
                default:'',//默认值

                //当 comType 为 select 时
                enumList:[], //下拉框可选项 

                //当 comType 为 dynamicSelect 时
                api:'xxxx' //下拉框数据源
              },
              formOption: {},
            },
          },
        },
        tableConfig: {
          headerButtons: [
            {
              label: "", //按钮名称
              eventKey: "", //btn事件名称
              eventOption: {}, //btn具体配置
              ...elButtonConfig, //标准的 el-button 配置
            },
            ...{},
          ],
          rowButtons: [
            {
              label: "", //按钮名称
              eventKey: "", //btn事件名称
              eventOption: {
                //when eventKey === remove
                params: {
                  //paramKey:参数的键值；
                  //rowValueKey: 参数值（当格式为schema::xxx时，到tableData中找相应的xxx字段）
                  paramKey: rowValueKey,
                },
              }, //btn具体配置
              ...elButtonConfig, //标准的 el-button 配置
            },
            ...{},
          ],
        }, // table 相关配置
        searchConfig: {}, // search-bar 相关配置
        components: {}, //模块组件
      },
    },
  ],
};
