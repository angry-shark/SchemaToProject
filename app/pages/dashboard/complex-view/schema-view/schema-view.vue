<template>
  <el-row class="schema-view">
    <search-panel
      v-if="searchSchema?.properties && Object.keys(searchSchema.properties).length > 0"
      @search="onSearch"
    ></search-panel>
    <table-panel
      ref="tablePanelRef"
      @operate="onTableOperate"
    ></table-panel>
    <component
      :is="ComponentConfig[key]?.component"
      v-for="(item, key) in components"
      :key="key"
      ref="comListRef"
      @command="onComponentCommand"
    ></component>
  </el-row>
</template>
<script setup>
import { provide, ref } from 'vue'
import SearchPanel from './complex-view/search-panel/search-panel.vue'
import TablePanel from './complex-view/table-panel/table-panel.vue'
import { useSchema } from './hooks/useSchema'
import ComponentConfig from './components/component-config'

const apiParams = ref({})

const tablePanelRef = ref(null)
const comListRef = ref([])

const onComponentCommand = () => { }

const {
  api,
  tableSchema,
  tableConfig,
  searchSchema,
  searchConfig,
  components
} = useSchema()

provide('schemaViewData', {
  api,
  apiParams,
  tableSchema,
  tableConfig,
  searchSchema,
  searchConfig,
  components
})

const onSearch = (searchValObj) => {
  apiParams.value = searchValObj
}

//table 事件映射
const EventHandlerMap = {
  'showComponent': showComponent
}

const onTableOperate = ({ btnConfig, rowData }) => {
  const { eventKey } = btnConfig
  if (EventHandlerMap[eventKey]) {
    EventHandlerMap[eventKey]({ btnConfig, rowData })
  }
}

// 展示动态组件
function showComponent({ btnConfig, rowData }) {
  const { comName } = btnConfig?.eventOption;
  if (!comName) { return; }

  const comRef = comListRef.value.find(item => {
    return item.name === comName
  })

  if (!comRef || typeof comRef.show !== 'function') {
    return;
  }

  comRef.show(rowData)
}
</script>
<style lang="less" scoped>
.schema-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>