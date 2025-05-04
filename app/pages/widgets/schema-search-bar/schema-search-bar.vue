<template>
  <el-form
    v-if="schema && schema.properties"
    :inline="true"
    class="schema-search-bar"
  >
    <!-- 动态组件区域 -->
    <el-form-item
      v-for="(schemaItem, key) in schema.properties"
      :key="key"
      :label="schemaItem.label"
    >
      <!-- 展示子组件 字符串到组件-->
      <component
        :is="SearchItemConfig[schemaItem.option?.comType]?.component"
        :ref="handleSearchComList"
        :schema-key="key"
        :schema="schemaItem"
        @loaded="handleChildLoaded"
      ></component>
    </el-form-item>
    <!-- 操作区域 -->
    <el-form-item>
      <el-button
        type="primary"
        plain
        class="search-btn"
        @click="search"
      >
        搜索
      </el-button>
      <el-button
        plain
        class="reset-btn"
        @click="reset"
      >
        重置
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { toRefs, ref } from 'vue'
import SearchItemConfig from './search-item-config.js'

const props = defineProps({
    /**
     *  {
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
              },
              formOption: {},
            },
          },
        },
     */
    schema: {
        type: Object,
        default: () => ({})
    }
})

const { schema } = toRefs(props)

const emits = defineEmits(['load', 'search', 'reset'])

const searchComList = ref([])
function handleSearchComList(el) {
    searchComList.value.push(el)
}

const getValues = () => {
    let dtoObj = {}
    searchComList.value.forEach(component => {
        dtoObj = {
            ...dtoObj,
            ...component?.getValue()
        }
    })
    return dtoObj
}

function search() {
    emits('search', getValues())
}

function reset() {
    searchComList.value.forEach(component => {
        component?.reset()
    })
    emits('reset')
}

let childComLoadedCount = 0
function handleChildLoaded() {
    childComLoadedCount++;
    if (childComLoadedCount > Object.keys(schema?.value?.properties).length) {
        emits('load', getValues())
    }
}

defineExpose({
    reset,
    getValues
})

</script>
<style lang="less">
.schema-search-bar {
    min-width: 500px;
    
    .input{ 
        width: 280px;
    }

    .select, .dynamic-select{
      width: 180px;
    }

    .search-btn {
        width: 100px;
    }

    .reset-btn {
        width: 100px;
    }
}
</style>