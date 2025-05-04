<template>
  <el-row class="schema-view">
    <search-panel
      v-if="searchSchema?.properties && Object.keys(searchSchema.properties).length > 0"
      @search="onSearch"
    ></search-panel>
    <table-panel @operate="onTableOperate"></table-panel>
  </el-row>
</template>
<script setup>
import { provide, ref } from 'vue'
import SearchPanel from './complex-view/search-panel/search-panel.vue'
import TablePanel from './complex-view/table-panel/table-panel.vue'
import { useSchema } from './hooks/useSchema'

const apiParams = ref({})

const {
  api,
  tableSchema,
  tableConfig,
  searchSchema,
  searchConfig
} = useSchema()

provide('schemaViewData', {
  api,
  apiParams,
  tableSchema,
  tableConfig,
  searchSchema,
  searchConfig
})

const onSearch = (searchValObj) => {
  apiParams.value = searchValObj
}

const onTableOperate = ({ btnConfig, rowData }) => {}

</script>
<style lang="less" scoped>
.schema-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>