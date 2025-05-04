<template>
  <el-card class="search-panel">
    <schema-search-bar
      :schema="searchSchema"
      @load="onLoad"
      @search="onSearch"
      @reset="onReset"
    ></schema-search-bar>
  </el-card>
</template>
<script setup>
import { inject } from "vue";
import SchemaSearchBar from '$widgets/schema-search-bar/schema-search-bar.vue'

const { searchSchema } = inject('schemaViewData')

const emits = defineEmits(['search'])

const onReset = () => {
  emits('search', {})
}

const onLoad = (searchValObj) => {
  emits('search', searchValObj)
}

const onSearch = (searchValObj) => {
  emits('search', searchValObj)
}

</script>
<style lang="less" scoped>
.search-panel{
  margin: 10px;
  :deep(.el-card__body){
    padding-bottom: 2px;
  }
}
</style>