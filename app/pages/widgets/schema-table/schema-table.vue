<template>
  <div class="schema-table">
    <el-table v-if="schema && schema.properties" v-loading="loading" :data="tableData" class="table">
      <template v-for="(schemaItem, key) in schema.properties">
        <el-table-column v-if="schemaItem.option.visible !== false" :key="key" :prop="key" :label="schemaItem.label"
          v-bind="schemaItem.option"></el-table-column>
      </template>
      <el-table-column v-if="buttons?.length > 0" label="操作" fixed="right" :width="operationWidth">
        <template #default="scope">
          <el-button v-for="item in buttons" :key="`${item.eventKey}-${scope.$index}`" link v-bind="item"
            @click="operationHandler({ btnConfig: item, rowData: scope.row })">
            {{ item.label }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="pagination" justify="end">
      <el-pagination :current-page="currentPage" :page-size="pageSize" :page-sizes="[10, 20, 50, 100, 200]"
        :total="total" layout="total,sizes,prev,pager,next,jumper" @size-change="onPageSizeChange"
        @current-change="onCurrentPageChange">
      </el-pagination>
    </el-row>
  </div>
</template>
<script setup>
import { computed, nextTick, onMounted, toRefs, ref, watch } from "vue"
import $curl from '$pages/common/curl.js'

const props = defineProps({
  /**
   * schema 配置结构如下
   {
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
              visible: true, //是否显示 true / false
            },
            searchOption: {},
            formOption: {},
          },
        },
      }
   */
  schema: {
    type: Object,
    default: () => ({})
  },
  /**
   * 表格数据源api
   */
  api: {
    type: String,
    default: ''
  },
  /**
   * api 请求参数，请求 api 时携带
   */
  apiParams: {
    type: Object,
    default: () => ({})
  },
  /**
   * 表格中的操作按钮配置 类型如下
   * {
   *   label: "", //按钮名称
   *   eventKey: "", //btn事件名称
   *   eventOption: {}, //btn具体配置
   *   ...elButtonConfig, //标准的 el-button 配置
   * }[]
   */
  buttons: {
    type: Array,
    default: () => ([])
  }
})

const { schema, api, buttons, apiParams } = toRefs(props)

const emits = defineEmits(['operate'])

const operationWidth = computed(() => {
  return buttons?.value?.length > 0 ? buttons.value.reduce((prev, cur) => {
    return prev + cur.label.length * 18
  }, 50) : 50
})


const loading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(50)
const total = ref(0)

onMounted(() => {
  initData()
})

watch([schema, api, apiParams], () => {
  initData()
}, { deep: true })

const initData = () => {
  currentPage.value = 1
  pageSize.value = 50
  nextTick(async () => {
    await loadTableData()
  })
}

let timerId = null
const loadTableData = async () => {
  clearTimeout(timerId)
  timerId = setTimeout(async () => {
    await fetchTableData()
    timerId = null //解除引用，避免内存泄露
  }, 100)

}


const fetchTableData = async () => {
  if (!api.value) {
    return
  }
  showLoading()

  //请求 table 数据
  const res = await $curl({
    method: 'get',
    url: `${api.value}/list`,
    query: {
      ...apiParams.value,
      page: currentPage.value,
      size: pageSize.value,
    }
  })

  hideLoading()

  if (!res || !res.success || !Array.isArray(res.data)) {
    tableData.value = []
    total.value = 0
    return;
  }

  tableData.value = buildTableData(res.data)
  total.value = res.metadata.total
}


/**
 * 对后端返回的列表数据，渲染预处理
 * @param listData 
 */
const buildTableData = (listData) => {
  if (!schema.value?.properties) {
    return listData
  }

  return listData.map(rowData => {
    for (const key in rowData) {
      const schemaItem = schema.value.properties[key]
      //处理 toFixed 配置
      if (schemaItem?.option?.toFixed) {
        rowData[key] = rowData[key].toFixed && rowData[key].toFixed(schemaItem.option.toFixed)
      }
    }
    return rowData

  })
}

const showLoading = () => {
  loading.value = true
}

const hideLoading = () => {
  loading.value = false
}

const operationHandler = ({ btnConfig, rowData }) => {
  emits('operate', { btnConfig, rowData })
}

const onCurrentPageChange = async (value) => {
  currentPage.value = value
  await loadTableData()
}

const onPageSizeChange = async (value) => {
  currentPage.value = 1
  pageSize.value = value
  await loadTableData();
}

defineExpose({
  initData,
  loadTableData,
  showLoading,
  hideLoading
})

</script>
<style lang="less" scoped>
.schema-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .table {
    flex: 1;
  }

  .pagination {
    margin: 10px 0;
    text-align: right;
  }
}
</style>