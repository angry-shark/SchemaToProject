import { ref, watch, onMounted, nextTick } from "vue";
import { useMenuStore } from "$store/menu.js";
import { useRoute } from "vue-router";

export const useSchema = () => {
  const route = useRoute();
  const menuStore = useMenuStore();

  const api = ref("");
  const tableSchema = ref({});
  const tableConfig = ref({});

  const searchSchema = ref({});
  const searchConfig = ref({});

  const components = ref({});

  watch(
    [
      () => route.query.key,
      () => route.query.sider_key,
      () => menuStore.menuList,
    ],
    () => {
      buildData();
    },
    { deep: true }
  );

  onMounted(() => {
    buildData();
  });

  //通用构建 schema 的方法
  function buildDtoSchema(_schema, comName) {
    if (!_schema?.properties) {
      return {};
    }

    const dtoSchema = {
      type: "object",
      properties: {},
    };

    //提取有效 schema 的字段信息（清除噪音）
    for (const key in _schema.properties) {
      const props = _schema.properties[key];
      //tableOption searchBarOption formOption
      if (props[`${comName}Option`]) {
        let dtoProps = {};
        //提取 props 中非 options 属性，存放到 dtoProps 中
        for (let pKey in props) {
          if (pKey.indexOf("Options") < 0) {
            dtoProps[pKey] = props[pKey];
          }
        }
        //处理 comName options
        dtoProps = Object.assign({}, dtoProps, {
          option: props[`${comName}Option`],
        });

        //处理 required 字段
        const { required } = _schema;
        if (required && required.find((pk) => pk === key)) {
          dtoProps.option.required = true;
        }
        dtoSchema.properties[key] = dtoProps;
      }
    }
    return dtoSchema;
  }

  //构造 schema 相关配置，给 schemaView 使用
  const buildData = () => {
    const { key, sider_key: siderKey } = route.query;

    const mItem = menuStore.findMenuItem({
      key: "key",
      value: siderKey ?? key,
    });

    if (mItem && mItem.schemaConfig) {
      const { schemaConfig: sConfig } = mItem;
      const configSchema = JSON.parse(JSON.stringify(sConfig.schema));

      api.value = sConfig.api ?? "";
      tableSchema.value = undefined;
      tableConfig.value = undefined;

      searchSchema.value = undefined;
      searchConfig.value = undefined;

      components.value = undefined;

      nextTick(() => {
        //构造 tableSchema & tableConfig
        tableSchema.value = buildDtoSchema(configSchema, "table");
        tableConfig.value = sConfig.tableConfig ?? {};

        //构造 searchSchema & searchConfig
        const dtoSearchSchema = buildDtoSchema(configSchema, "search");
        //带上url中的搜索值
        for (let key in dtoSearchSchema.properties) {
          if (route.query[key] !== undefined) {
            dtoSearchSchema.properties[key].option.default = route.query[key];
          }
        }
        searchSchema.value = dtoSearchSchema;
        searchConfig.value = sConfig.searchConfig ?? {};

        //构造 components = {compKey: {schema, config}} 的配置
        const { componentConfig } = sConfig;

        if (componentConfig && Object.keys(componentConfig).length > 0) {
          let dtoComponents = {};
          for (const compName in componentConfig) {
            dtoComponents[compName] = {
              schema: buildDtoSchema(configSchema, compName),
              config: componentConfig[compName],
            };
          }
          components.value = dtoComponents;
        }
      });
    }
  };

  return {
    api,
    tableSchema,
    tableConfig,
    searchSchema,
    searchConfig,
    components,
  };
};
